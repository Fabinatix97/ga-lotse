/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { MatrixEvent, MatrixEventEvent, Room, RoomEvent } from "matrix-js-sdk";
import { KnownMembership } from "matrix-js-sdk/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import { isNullish, omit } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";

export interface NotificationContextType {
  unreadNotificationsPerRoom: Record<string, number>;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: RequiresChildren) {
  const { matrixClient, clientState } = useChatClientContext();
  const [unreadNotificationsPerRoom, setUnreadNotificationsPerRoom] = useState<
    Record<string, number>
  >({});

  // Initial check for unread messages
  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;

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
  }, [clientState, matrixClient]);

  // Setting listeners for unread messages
  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;

    function setUnreadNotification(event: MatrixEvent, room?: Room | Error) {
      let eventRoom = room instanceof Error ? undefined : room;
      let roomId = eventRoom?.roomId;

      if (!eventRoom || !roomId) {
        roomId = event?.getRoomId();
        if (!roomId) return;
        eventRoom = matrixClient.getRoom(roomId) ?? undefined;
      }

      if (!eventRoom) return;

      const unreadMessages = eventRoom.getUnreadNotificationCount();

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
  }, [clientState, matrixClient]);

  return (
    <NotificationContext.Provider value={{ unreadNotificationsPerRoom }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (isNullish(context)) {
    throw new Error(
      "useNotificationContext was called outside NotificationProvider",
    );
  }
  return context;
}
