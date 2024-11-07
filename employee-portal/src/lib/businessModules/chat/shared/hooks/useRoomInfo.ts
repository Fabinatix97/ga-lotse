/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, Room } from "matrix-js-sdk";
import { useCallback, useMemo } from "react";
import { filter, find, isStrictEqual } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { ChatRoomMember } from "@/lib/businessModules/chat/shared/types";
import {
  getMemberAvatarUrl,
  getRoomAdmins,
  getRoomAvatarUrl,
  getRoomCreator,
  getRoomNameAndCommunicationType,
  isDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

export interface RoomInfo {
  room: Room | null;
  roomCreator?: string;
  communicationType?: CommunicationType;
  allRoomMembers: ChatRoomMember[];
  dmRoomMember: ChatRoomMember | undefined;
  matrixClient: MatrixClient;
  checkIfAdmin: () => boolean;
  getAvatarUrl: () => string | null;
  getJoinedMembers: () => ChatRoomMember[];
  getJoinedAndInvitedMembers: () => ChatRoomMember[];
  exceptMe: (roomMembers: ChatRoomMember[]) => ChatRoomMember[];
}

export function useRoomInfo(roomId: string): RoomInfo {
  const { matrixClient } = useChatClientContext();

  const room = matrixClient.getRoom(roomId);
  const loggedInUserId = matrixClient.getUserId();

  const rct = useMemo(
    () => (room ? getRoomNameAndCommunicationType(room) : undefined),
    [room],
  );

  const roomCreator = useMemo(() => getRoomCreator(room), [room]);

  const exceptMe = useCallback(
    (roomMembers: ChatRoomMember[]) =>
      filter(
        roomMembers,
        (m) => !isStrictEqual(m.member.userId, room?.myUserId),
      ),
    [room?.myUserId],
  );

  const checkIfAdmin = useCallback(
    () =>
      Boolean(
        find(getRoomAdmins(room), (u) => isStrictEqual(u, loggedInUserId)),
      ),
    [loggedInUserId, room],
  );

  const allRoomMembers: ChatRoomMember[] = useMemo(
    () =>
      room?.getMembers().map((member) => ({
        member,
        isRoomCreator: isStrictEqual(member.userId, roomCreator),
      })) ?? [],
    [room, roomCreator],
  );

  const dmRoomMember = isDMRoom(rct?.communicationType)
    ? exceptMe(allRoomMembers)?.[0]
    : undefined;

  const getJoinedMembers = useCallback(
    () => filter(allRoomMembers, (m) => m.member.membership === "join"),
    [allRoomMembers],
  );

  const getJoinedAndInvitedMembers = useCallback(
    () => filter(allRoomMembers, (m) => m.member.membership !== "leave"),
    [allRoomMembers],
  );

  const getAvatarUrl = useCallback(
    () =>
      isDMRoom(rct?.communicationType)
        ? getMemberAvatarUrl(matrixClient, dmRoomMember?.member)
        : getRoomAvatarUrl(matrixClient, room),
    [dmRoomMember?.member, matrixClient, rct?.communicationType, room],
  );

  return {
    room,
    roomCreator,
    communicationType: rct?.communicationType,
    allRoomMembers,
    dmRoomMember,
    matrixClient,
    getAvatarUrl,
    getJoinedMembers,
    getJoinedAndInvitedMembers,
    checkIfAdmin,
    exceptMe,
  };
}
