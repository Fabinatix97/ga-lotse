/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EventStatus,
  MatrixEvent,
  MatrixEventEvent,
  Room,
  RoomEvent,
  RoomMember,
  RoomMemberEvent,
} from "matrix-js-sdk/lib/matrix";
import { useCallback, useEffect, useState } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { useRoomMessages } from "@/lib/businessModules/chat/shared/hooks/useRoomMessages";
import {
  RoomEventDetails,
  RoomWithCommunicationType,
  isChatMessageType,
} from "@/lib/businessModules/chat/shared/types";
import {
  findLatestMessage,
  getReadReceipts,
  getRoomNameAndCommunicationType,
} from "@/lib/businessModules/chat/shared/utils";

export function useChatRoomList() {
  const { matrixClient, clientState } = useChatClientContext();
  const [roomList, setRoomList] = useState<RoomWithCommunicationType[]>([]);
  const { onMessage } = useRoomMessages();

  const getLatestMessage = useCallback(
    async (room: Room) => {
      const latestEvent = findLatestMessage(room);
      if (!latestEvent) return;
      const newMessage = await onMessage({ event: latestEvent, room });
      const readReceiptsObj = getReadReceipts(
        latestEvent,
        room,
        matrixClient.getUserId(),
      );
      if (!isChatMessageType(newMessage)) return;
      return { ...newMessage, readReceipts: readReceiptsObj };
    },
    [matrixClient, onMessage],
  );

  useEffect(() => {
    void (async () => {
      if (clientState !== ClientState.Prepared) {
        return;
      }
      await matrixClient.syncLeftRooms();
      const rooms = matrixClient.getRooms();
      const joinedRooms = rooms.filter(
        (room) => room.getMyMembership() === "join",
      );
      const roomsWithType = await Promise.all(
        joinedRooms.map(async (room) => {
          const membershipStatus = room.getMyMembership();
          if (membershipStatus === "invite") return;
          const roomWithCommunicationType =
            getRoomNameAndCommunicationType(room);
          const latestMessage = await getLatestMessage(room);
          return { ...roomWithCommunicationType, latestMessage: latestMessage };
        }),
      );
      const roomWithTypeFiltered = roomsWithType.filter((item) => !!item);
      const invitations = rooms.filter(
        (room) => room.getMyMembership() === "invite",
      );
      invitations.forEach((invitation) => {
        void matrixClient.joinRoom(invitation.roomId);
      });
      setRoomList(roomWithTypeFiltered);
    })();
  }, [clientState, getLatestMessage, matrixClient]);

  // Listening for my membership in chat rooms
  useEffect(() => {
    async function onMyMembership(room: Room, membership: string) {
      const latestMessage = await getLatestMessage(room);
      const roomWithType = getRoomNameAndCommunicationType(room);
      setRoomList((prevState) => {
        if (membership === "join") {
          return [...prevState, { ...roomWithType, latestMessage }];
        }
        if (membership === "leave") {
          return prevState.filter(
            (joinedRoom) => joinedRoom.room.roomId !== room.roomId,
          );
        }
        return prevState;
      });
    }
    function handleMembership(room: Room, membership: string) {
      void onMyMembership(room, membership);
    }
    matrixClient.on(RoomEvent.MyMembership, handleMembership);

    return () => {
      matrixClient.removeListener(RoomEvent.MyMembership, handleMembership);
    };
  }, [getLatestMessage, matrixClient]);

  const onRoomMessage = useCallback(
    async ({ event, room }: RoomEventDetails) => {
      const newMessage = await onMessage({ event, room });
      const readReceiptsObj = getReadReceipts(
        event,
        room,
        matrixClient.getUserId(),
      );
      if (!newMessage) return;

      setRoomList((prevState) => {
        return prevState.map((roomItem) => {
          if (roomItem.room.roomId !== room.roomId) {
            return roomItem;
          }
          if (
            (roomItem.latestMessage?.timestamp?.getTime() ?? 0) >
            (newMessage.timestamp?.getTime() ?? 0)
          ) {
            return roomItem;
          }
          return {
            ...roomItem,
            latestMessage: {
              ...newMessage,
              readReceipts: readReceiptsObj,
            },
          };
        });
      });
    },
    [matrixClient, onMessage],
  );

  // Subscribe to room timeline
  useEffect(() => {
    async function onMembership({ room }: RoomEventDetails) {
      const updatedRoom = getRoomNameAndCommunicationType(room);
      const latestMessage = await getLatestMessage(room);

      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId
            ? { ...updatedRoom, latestMessage }
            : prevRoom,
        ),
      );
    }

    function onRoomAvatar(room: Room) {
      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId ? { ...prevRoom } : prevRoom,
        ),
      );
    }

    async function joinRoomWhenInvited(
      _: MatrixEvent,
      member: RoomMember,
    ): Promise<void> {
      const loggedInUserId = matrixClient.getUserId();
      if (member.membership === "invite" && member.userId === loggedInUserId) {
        try {
          await matrixClient.joinRoom(member.roomId);
        } catch {}
      }
    }

    function onRoomTimeline(
      event: MatrixEvent,
      room: Room | undefined,
      _: boolean | undefined,
      removed: boolean,
    ) {
      if (!room) {
        return;
      }
      const eventType = event.getType();
      if (eventType === "m.room.avatar") {
        onRoomAvatar(room);
      }
      // room membership
      if (eventType === "m.room.member") {
        void onMembership({ event, room, removed });
      }
      // new message - add latest message to room object
      if (eventType === "m.room.message" || eventType === "m.room.encrypted") {
        void onRoomMessage({ event, room });
        // We call the onMessage function again when the message ID changes from a temporary one to the actual ID received from the server.
        event.on(MatrixEventEvent.Status, (eventEvent, status) => {
          if (status === EventStatus.SENT) {
            void onRoomMessage({ event: eventEvent, room });
          }
        });
      }
    }

    function handleMembership(event: MatrixEvent, member: RoomMember) {
      void joinRoomWhenInvited(event, member);
    }

    matrixClient.on(RoomEvent.Timeline, onRoomTimeline);
    matrixClient.on(RoomMemberEvent.Membership, handleMembership);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, onRoomTimeline);
    };
  }, [getLatestMessage, matrixClient, onRoomMessage]);

  return { roomList };
}
