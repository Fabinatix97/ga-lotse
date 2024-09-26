/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Direction, EventType, MatrixClient, Room } from "matrix-js-sdk";
import { useMemo } from "react";
import { isStrictEqual } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { AllRoomMembers } from "@/lib/businessModules/chat/shared/types";
import {
  getMemberAvatarUrl,
  getRoomAvatarUrl,
  getRoomNameAndCommunicationType,
  isDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

export interface RoomInfo {
  room: Room | null;
  roomCreator?: string;
  communicationType?: CommunicationType;
  roomAvatarUrl: string | null;
  allRoomMembers: AllRoomMembers[];
  roomMembers: AllRoomMembers[];
  dmRoomMember: AllRoomMembers | undefined;
  isAdmin: boolean;
  matrixClient: MatrixClient;
}

export function useRoomInfo(roomId: string): RoomInfo {
  const { matrixClient } = useChatClientContext();

  const room = matrixClient.getRoom(roomId);
  const rct = useMemo(
    () => (room ? getRoomNameAndCommunicationType(room) : undefined),
    [room],
  );

  const roomCreator = useMemo(
    () =>
      room
        ?.getLiveTimeline()
        .getState(Direction.Forward)
        ?.getStateEvents(EventType.RoomCreate)?.[0]?.event.sender,
    [room],
  );

  const allRoomMembers =
    room?.getMembers().map((member) => ({
      member,
      isRoomCreator: isStrictEqual(member.userId, roomCreator),
    })) ?? [];

  const roomMembers = allRoomMembers?.filter(
    ({ member }) => !isStrictEqual(member.userId, room?.myUserId),
  );

  const dmRoomMember = isDMRoom(rct?.communicationType)
    ? roomMembers?.[0]
    : undefined;

  const roomAvatarUrl = useMemo(
    () =>
      isDMRoom(rct?.communicationType)
        ? getMemberAvatarUrl(matrixClient, dmRoomMember?.member)
        : getRoomAvatarUrl(matrixClient, room),
    [dmRoomMember?.member, matrixClient, rct?.communicationType, room],
  );

  const isAdmin = isStrictEqual(matrixClient.getUserId(), roomCreator);

  return {
    room,
    roomCreator,
    communicationType: rct?.communicationType,
    roomAvatarUrl,
    roomMembers,
    allRoomMembers,
    dmRoomMember,
    isAdmin,
    matrixClient,
  };
}
