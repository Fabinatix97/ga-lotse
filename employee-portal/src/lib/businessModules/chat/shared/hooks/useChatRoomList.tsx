/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMilliseconds, format } from "date-fns";
import {
  EventStatus,
  MatrixEvent,
  MatrixEventEvent,
  Room,
  RoomEvent,
  RoomMemberEvent,
} from "matrix-js-sdk";
import { KnownMembership } from "matrix-js-sdk/lib/types";
import { useCallback, useEffect, useState } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  CommunicationType,
  MessageTypeEnum,
} from "@/lib/businessModules/chat/shared/enums";
import {
  RoomData,
  RoomEventDetails,
  isChatMessageType,
} from "@/lib/businessModules/chat/shared/types";
import {
  findLatestMessage,
  getReadReceipts,
  getRoomNameAndCommunicationType,
  setDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

export function useChatRoomList() {
  const { matrixClient } = useChatClientContext();
  const [roomList, setRoomList] = useState<RoomData[]>([]);

  const onMessage = useCallback(
    async ({ event, room }: RoomEventDetails) => {
      if (event.isEncrypted()) {
        await matrixClient.decryptEventIfNeeded(event);
      }
      const messageContent = event.getContent();
      const id =
        event.getId() ??
        format(addMilliseconds(new Date(), Math.random() * 1000), "T");
      const sender = matrixClient.getUser(event.getSender() ?? "");

      return {
        sender,
        content: messageContent.body as string,
        timestamp: event.getDate(),
        id,
        roomId: room?.roomId,
        mentions: messageContent["m.mentions"]?.user_ids,
        messageType: MessageTypeEnum.ChatMessage,
        removed: false,
      };
    },
    [matrixClient],
  );

  const getLatestMessage = useCallback(
    async (room: Room) => {
      const latestEvent = findLatestMessage(room);
      if (!latestEvent) return;
      const newMessage = await onMessage({ event: latestEvent, room });
      const isRead = getReadReceipts(
        latestEvent,
        room,
        matrixClient.getUserId(),
      );
      if (!isChatMessageType(newMessage)) return;
      return { ...newMessage, isRead, sent: true };
    },
    [matrixClient, onMessage],
  );

  useEffect(() => {
    void (async () => {
      const rooms = matrixClient.getRooms();
      const joinedRooms = rooms.filter(
        (room) => room.getMyMembership() === KnownMembership.Join.toString(),
      );
      const roomsWithType = await Promise.all(
        joinedRooms.map(async (room) => {
          const membershipStatus = room.getMyMembership();
          if (membershipStatus === "invite") return;
          const roomWithCommunicationType = getRoomNameAndCommunicationType(
            matrixClient,
            room,
          );
          const latestMessage = await getLatestMessage(room);
          return { ...roomWithCommunicationType, latestMessage: latestMessage };
        }),
      );
      const roomWithTypeFiltered = roomsWithType.filter((item) => !!item);
      const invitations = rooms.filter(
        (room) => room.getMyMembership() === "invite",
      );
      await Promise.all(
        invitations.map(async (invitation) => {
          await matrixClient.joinRoom(invitation.roomId);
          const roomWithType = getRoomNameAndCommunicationType(
            matrixClient,
            invitation,
          );
          if (
            roomWithType.communicationType === CommunicationType.DirectMessage
          ) {
            // set room as direct
            await setDMRoom(
              matrixClient,
              invitation.roomId,
              matrixClient.getUserId(),
            );
          }
        }),
      );
      setRoomList(roomWithTypeFiltered);
    })();
  }, [getLatestMessage, matrixClient]);

  // Listening for my membership in chat rooms
  useEffect(() => {
    async function onMyMembership(room: Room, membership: string) {
      const latestMessage = await getLatestMessage(room);
      const roomWithType = getRoomNameAndCommunicationType(matrixClient, room);
      if (roomWithType.communicationType === CommunicationType.DirectMessage) {
        // set room as direct
        await setDMRoom(matrixClient, room.roomId, matrixClient.getUserId());
      }
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

  useEffect(() => {
    async function onMembership(event: MatrixEvent) {
      const roomId = event.getContent()?.roomId as string;
      if (!roomId) return;
      const room = matrixClient.getRoom(roomId);
      if (!room) return;
      const latestMessage = await getLatestMessage(room);
      const roomWithType = getRoomNameAndCommunicationType(matrixClient, room);
      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId
            ? { ...roomWithType, latestMessage }
            : prevRoom,
        ),
      );
    }

    function handleMembership(event: MatrixEvent) {
      void onMembership(event);
    }

    matrixClient.on(RoomMemberEvent.Membership, handleMembership);

    return () => {
      matrixClient.removeListener(RoomMemberEvent.Membership, handleMembership);
    };
  }, [getLatestMessage, matrixClient]);

  const onRoomMessage = useCallback(
    async ({ event, room, isSent }: RoomEventDetails) => {
      const newMessage = await onMessage({ event, room });
      const isRead = getReadReceipts(event, room, matrixClient.getUserId());

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
              isRead,
              sent: !!isSent,
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
      const updatedRoom = getRoomNameAndCommunicationType(matrixClient, room);
      const latestMessage = await getLatestMessage(room);

      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId
            ? { ...updatedRoom, latestMessage }
            : prevRoom,
        ),
      );
    }

    function onRoomAvatar(event: MatrixEvent, room: Room) {
      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId
            ? { ...prevRoom, room }
            : prevRoom,
        ),
      );
    }

    function onRoomTimelineSync(_: MatrixEvent, room: Room) {
      const updatedRoom = getRoomNameAndCommunicationType(matrixClient, room);
      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId
            ? { ...prevRoom, updatedRoom }
            : prevRoom,
        ),
      );
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
        onRoomAvatar(event, room);
      }
      // room membership
      if (eventType === "m.room.member") {
        void onMembership({ event, room, removed });
      }
      // new message - add latest message to room object
      if (
        eventType === "m.room.message" ||
        eventType === "m.room.encrypted" ||
        eventType === "m.room.redaction"
      ) {
        const isSentByCurrentUser =
          event.getSender() === matrixClient.getUserId();
        void onRoomMessage({ event, room, isSent: !isSentByCurrentUser });
        // We call the onMessage function again when the message ID changes from a temporary one to the actual ID received from the server.
        event.on(MatrixEventEvent.Status, (eventEvent, status) => {
          if (status === EventStatus.SENT) {
            void onRoomMessage({ event: eventEvent, room, isSent: true });
          }
        });
      }
      if (eventType === "m.room.name" || eventType === "m.room.power_levels") {
        onRoomTimelineSync(event, room);
      }
    }

    matrixClient.on(RoomEvent.Timeline, onRoomTimeline);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, onRoomTimeline);
    };
  }, [getLatestMessage, matrixClient, onRoomMessage]);

  return { roomList };
}
