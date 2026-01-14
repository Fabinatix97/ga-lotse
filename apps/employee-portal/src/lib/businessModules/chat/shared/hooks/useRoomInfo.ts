/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Room, RoomMember } from "matrix-js-sdk";
import { useCallback, useMemo } from "react";
import { find, isStrictEqual } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import {
  getDirectMessageRoomMember,
  getMemberAvatarUrl,
  getRoomAdmins,
  getRoomAvatarUrl,
  getRoomCommunicationType,
  getRoomCreator,
  isDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

interface RoomInfo {
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
  const communicationType = room
    ? getRoomCommunicationType(matrixClient, room)
    : CommunicationType.PublicRoom;
  const roomCreator = useMemo(() => getRoomCreator(room), [room]);

  const getDMRoomMember = useCallback(() => {
    if (room && isDMRoom(communicationType)) {
      return getDirectMessageRoomMember(room);
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
