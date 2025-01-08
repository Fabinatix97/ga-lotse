/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Room, RoomMember } from "matrix-js-sdk";
import { useCallback, useMemo } from "react";
import { filter, find, isStrictEqual } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import {
  getMemberAvatarUrl,
  getRoomAdmins,
  getRoomAvatarUrl,
  getRoomCommunicationType,
  getRoomCreator,
  isDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

export interface RoomInfo {
  room: Room | null;
  roomCreator?: string;
  communicationType?: CommunicationType;
  getDMRoomMember: () => RoomMember | undefined;
  checkIfAdmin: () => boolean;
  getAvatarUrl: () => string | null;
}

export function useRoomInfo(roomId?: string): RoomInfo {
  const { matrixClient } = useChatClientContext();

  const room = matrixClient.getRoom(roomId);
  const communicationType = getRoomCommunicationType(matrixClient, roomId);
  const roomCreator = useMemo(() => getRoomCreator(room), [room]);

  const getDMRoomMember = useCallback(() => {
    const members = room?.getMembers();

    if (members?.length && isDMRoom(communicationType)) {
      return filter(
        members,
        (m) => !isStrictEqual(m.userId, room?.myUserId),
      )?.[0];
    }
  }, [communicationType, room]);

  const getAvatarUrl = useCallback(
    () =>
      isDMRoom(communicationType)
        ? getMemberAvatarUrl(matrixClient, getDMRoomMember())
        : getRoomAvatarUrl(matrixClient, room),
    [communicationType, getDMRoomMember, matrixClient, room],
  );

  const checkIfAdmin = useCallback(
    () =>
      Boolean(
        find(getRoomAdmins(room), (u) => isStrictEqual(u, room?.myUserId)),
      ),
    [room],
  );

  return {
    room,
    roomCreator,
    communicationType,
    getDMRoomMember,
    getAvatarUrl,
    checkIfAdmin,
  };
}
