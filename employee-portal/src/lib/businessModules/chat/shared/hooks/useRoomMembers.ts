/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MatrixEvent,
  RoomMember,
  RoomState,
  RoomStateEvent,
} from "matrix-js-sdk";
import { useEffect, useMemo, useState } from "react";
import { filter, isStrictEqual, map } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  getRoomAdmins,
  getRoomCreator,
} from "@/lib/businessModules/chat/shared/utils";

export function useRoomMembers(roomId: string) {
  const { matrixClient } = useChatClientContext();
  const [roomMembers, setRoomMembers] = useState<RoomMember[]>(
    matrixClient.getRoom(roomId)?.getMembers() ?? [],
  );
  const loggedInUserId = matrixClient.getUserId();

  useEffect(() => {
    function onRoomMember(event: MatrixEvent, state: RoomState) {
      const currentRoomId = state.roomId;
      if (isStrictEqual(currentRoomId, roomId)) {
        setRoomMembers(state.getMembers());
      }
    }

    matrixClient.on(RoomStateEvent.Members, onRoomMember);
    return () => {
      matrixClient.off(RoomStateEvent.Members, onRoomMember);
    };
  }, [matrixClient, roomId]);

  const roomCreatorId = useMemo(
    () => getRoomCreator(matrixClient.getRoom(roomId)),
    [matrixClient, roomId],
  );

  const allRoomMembers = useMemo(() => {
    const roomAdmins = getRoomAdmins(matrixClient.getRoom(roomId));
    return map(roomMembers, (m) => ({
      member: m,
      isRoomCreator: isStrictEqual(m.userId, roomCreatorId),
      isAdmin: roomAdmins.includes(m.userId),
    }));
  }, [matrixClient, roomCreatorId, roomId, roomMembers]);

  const joinedMembers = useMemo(() => {
    return [
      ...filter(allRoomMembers, (m) => m.isRoomCreator),
      ...filter(
        allRoomMembers,
        (m) => !m.isRoomCreator && m.member.membership === "join",
      ),
    ];
  }, [allRoomMembers]);

  const invitedMembers = useMemo(
    () => [...filter(allRoomMembers, (m) => m.member.membership === "invite")],
    [allRoomMembers],
  );

  const joinedAndInvitedMembersWithoutMe = useMemo(
    () => [
      ...filter(
        joinedMembers,
        (m) => !isStrictEqual(m.member.userId, loggedInUserId),
      ),
      ...invitedMembers,
    ],
    [invitedMembers, joinedMembers, loggedInUserId],
  );

  return {
    allRoomMembers,
    joinedMembers,
    invitedMembers,
    joinedAndInvitedMembersWithoutMe,
  };
}
