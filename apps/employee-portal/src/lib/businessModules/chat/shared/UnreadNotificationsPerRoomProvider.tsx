/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MatrixEvent,
  MatrixEventEvent,
  NotificationCountType,
  Room,
  RoomEvent,
} from "matrix-js-sdk";
import { KnownMembership } from "matrix-js-sdk/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import { omit } from "remeda";

import { RequiresChildren } from "@eshg/lib-portal";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { getRoomCommunicationType } from "@/lib/businessModules/chat/shared/utils";

export type UnreadNotificationsPerRoom = Record<string, number>;

export const UnreadNotificationsPerRoomContext =
  createContext<UnreadNotificationsPerRoom | null>(null);

export function UnreadNotificationsPerRoomProvider({
  children,
}: RequiresChildren) {
  const { matrixClient, isClientPrepared } = useChatClientContext();
  const [unreadNotificationsPerRoom, setUnreadNotificationsPerRoom] =
    useState<UnreadNotificationsPerRoom>({});

  // Initial check for unread messages
  useEffect(() => {
    if (!isClientPrepared) return;

    const rooms = matrixClient.getRooms();
    const joinedRooms = rooms.filter(
      (room) => room.getMyMembership() === KnownMembership.Join.toString(),
    );

    const initialNotifications = joinedRooms?.reduce<Record<string, number>>(
      (acc, room) => {
        const unreadMessagesCount = room.getUnreadNotificationCount();
        return unreadMessagesCount
          ? { ...acc, [room.roomId]: unreadMessagesCount }
          : acc;
      },
      {},
    );

    setUnreadNotificationsPerRoom(initialNotifications);
  }, [isClientPrepared, matrixClient]);

  // Setting listeners for unread messages
  useEffect(() => {
    if (!isClientPrepared) return;

    function setUnreadNotification(event: MatrixEvent, room?: Room | Error) {
      let eventRoom = room instanceof Error ? undefined : room;
      let roomId = eventRoom?.roomId;
      if (!eventRoom || !roomId) {
        roomId = event?.getRoomId();
        if (!roomId) return;
        eventRoom = matrixClient.getRoom(roomId) ?? undefined;
      }

      if (!eventRoom) return;
      const communicationType = getRoomCommunicationType(
        matrixClient,
        eventRoom,
      );
      const unreadMessages = eventRoom.getUnreadNotificationCount(
        communicationType === CommunicationType.DirectMessage
          ? NotificationCountType.Total
          : NotificationCountType.Highlight,
      );

      setUnreadNotificationsPerRoom((prevState) => {
        let state = { ...prevState, [roomId]: unreadMessages };
        if (unreadMessages === 0) {
          state = omit(state, [roomId]);
        }
        return state;
      });
    }

    matrixClient.on(RoomEvent.Timeline, setUnreadNotification);
    matrixClient.on(RoomEvent.Receipt, setUnreadNotification);
    matrixClient.on(RoomEvent.Redaction, setUnreadNotification);
    matrixClient.on(MatrixEventEvent.Decrypted, setUnreadNotification);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, setUnreadNotification);
      matrixClient.removeListener(RoomEvent.Receipt, setUnreadNotification);
      matrixClient.removeListener(RoomEvent.Redaction, setUnreadNotification);
      matrixClient.removeListener(
        MatrixEventEvent.Decrypted,
        setUnreadNotification,
      );
    };
  }, [isClientPrepared, matrixClient]);

  return (
    <UnreadNotificationsPerRoomContext value={unreadNotificationsPerRoom}>
      {children}
    </UnreadNotificationsPerRoomContext>
  );
}

export function useUnreadNotificationsPerRoom(): UnreadNotificationsPerRoom {
  const context = useContext(UnreadNotificationsPerRoomContext);
  if (context === null) {
    throw new Error(
      "useUnreadNotificationsPerRoomContext was called outside UnreadNotificationsPerRoomProvider",
    );
  }
  return context;
}
