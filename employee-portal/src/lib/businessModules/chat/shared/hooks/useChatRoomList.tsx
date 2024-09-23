/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MatrixEvent,
  Room,
  RoomEvent,
  RoomMember,
  RoomMemberEvent,
} from "matrix-js-sdk/lib/matrix";
import { useEffect, useState } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import {
  RoomEventDetails,
  RoomWithCommunicationType,
} from "@/lib/businessModules/chat/shared/types";
import { getRoomNameAndCommunicationType } from "@/lib/businessModules/chat/shared/utils";

export function useChatRoomList() {
  const { matrixClient, clientState } = useChatClientContext();
  const [roomList, setRoomList] = useState<RoomWithCommunicationType[]>([]);

  useEffect(() => {
    if (clientState !== ClientState.Prepared) {
      return;
    }
    const rooms = matrixClient.getRooms();
    const roomsWithType = rooms
      .filter((room) => room.getMyMembership() === "join")
      .map((room) => getRoomNameAndCommunicationType(room));
    const invitations = rooms.filter(
      (room) => room.getMyMembership() === "invite",
    );
    invitations.forEach((invitation) => {
      void matrixClient.joinRoom(invitation.roomId);
    });
    setRoomList(roomsWithType);
  }, [clientState, matrixClient]);

  // Listening for my membership in chat rooms
  useEffect(() => {
    function onMyMembership(room: Room, membership: string) {
      setRoomList((prevState) => {
        if (membership === "join") {
          const roomWithType = getRoomNameAndCommunicationType(room);
          return [...prevState, roomWithType];
        }

        if (membership === "leave") {
          return prevState.filter(
            (joinedRoom) => joinedRoom.room.roomId !== room.roomId,
          );
        }

        return prevState;
      });
    }
    matrixClient.on(RoomEvent.MyMembership, onMyMembership);

    return () => {
      matrixClient.removeListener(RoomEvent.MyMembership, onMyMembership);
    };
  }, [matrixClient]);

  // Subscribe to room timeline
  useEffect(() => {
    function onMembership({ room }: RoomEventDetails) {
      const updatedRoom = getRoomNameAndCommunicationType(room);

      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId ? updatedRoom : prevRoom,
        ),
      );
    }

    function onRoomAvatar(room: Room) {
      setRoomList((prevState) =>
        prevState.map((prevRoom) =>
          prevRoom.room.roomId === room.roomId
            ? { room, communicationType: prevRoom.communicationType }
            : prevRoom,
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
        onMembership({ event, room, removed });
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
  }, [matrixClient]);

  return { roomList };
}
