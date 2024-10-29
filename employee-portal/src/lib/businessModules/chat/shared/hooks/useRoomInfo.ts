/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Direction, EventType, MatrixClient, Room } from "matrix-js-sdk";
import { useEffect, useMemo, useState } from "react";
import { isStrictEqual } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { ChatRoomMember } from "@/lib/businessModules/chat/shared/types";
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
  avatarUrl: string | null;
  allRoomMembers: ChatRoomMember[];
  joinedMembers: ChatRoomMember[];
  roomMembers: ChatRoomMember[];
  dmRoomMember: ChatRoomMember | undefined;
  isAdmin: boolean;
  matrixClient: MatrixClient;
}

export function useRoomInfo(roomId: string): RoomInfo {
  const { matrixClient } = useChatClientContext();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    void (async () => {
      const userId = matrixClient.getUserId();
      if (!userId) return;
      try {
        const data = await matrixClient.getStateEvent(
          roomId,
          EventType.RoomPowerLevels,
          "",
        );
        const powerLevels = ("users" in data ? data.users : data) as Record<
          string,
          number
        >;
        const userPowerLevel = powerLevels?.[userId] ?? 0;
        setIsAdmin(userPowerLevel === 100);
      } catch (error) {
        logger.error("Daten konnten nicht heruntergeladen werden", error);
      }
    })();
  }, [matrixClient, roomId]);

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
  const joinedMembers = allRoomMembers?.filter(
    (roomMember) => roomMember.member.membership === "join",
  );
  const roomMembers = joinedMembers?.filter(
    ({ member }) => !isStrictEqual(member.userId, room?.myUserId),
  );

  const dmRoomMember = isDMRoom(rct?.communicationType)
    ? roomMembers?.[0]
    : undefined;

  const avatarUrl = useMemo(
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
    avatarUrl,
    roomMembers,
    allRoomMembers,
    joinedMembers,
    dmRoomMember,
    isAdmin,
    matrixClient,
  };
}
