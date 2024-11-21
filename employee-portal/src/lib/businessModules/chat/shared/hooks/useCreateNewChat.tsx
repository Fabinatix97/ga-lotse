/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EventType,
  HistoryVisibility,
  ICreateRoomOpts,
  JoinRule,
  Preset,
  Visibility,
} from "matrix-js-sdk/lib/matrix";
import { KnownMembership } from "matrix-js-sdk/lib/types";
import { useCallback } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import {
  findDirectChat,
  getRoomNameAndCommunicationType,
} from "@/lib/businessModules/chat/shared/utils";

export const MEGOLM_ENCRYPTION_ALGORITHM = "m.megolm.v1.aes-sha2";

export function useCreateNewChat() {
  const { matrixClient } = useChatClientContext();
  const { setRoomIdParam } = useChatSearchParams();

  const findExisingRoom = useCallback(
    (userId: string) => {
      const joinedRooms = matrixClient
        .getRooms()
        .filter(
          (room) => room.getMyMembership() === KnownMembership.Join.toString(),
        );
      const chatRooms = joinedRooms.map((room) =>
        getRoomNameAndCommunicationType(room),
      );

      return findDirectChat({ chatRooms, userId });
    },
    [matrixClient],
  );

  const createRoom = useCallback(
    async (opts: ICreateRoomOpts) => {
      if (opts.is_direct && opts.invite?.[0]) {
        const dmRoom = findExisingRoom(opts.invite?.[0]);
        if (dmRoom) {
          return dmRoom.room.roomId;
        }
      }

      const createOpts: ICreateRoomOpts = opts;

      createOpts.preset = opts.is_direct
        ? Preset.TrustedPrivateChat
        : Preset.PrivateChat;

      createOpts.room_version = "10";

      createOpts.visibility = Visibility.Private;

      createOpts.initial_state = [
        {
          type: EventType.RoomHistoryVisibility,
          content: {
            history_visibility: HistoryVisibility.Invited,
          },
        },
        {
          type: EventType.RoomEncryption,
          state_key: "",
          content: {
            algorithm: MEGOLM_ENCRYPTION_ALGORITHM,
          },
        },
        {
          type: EventType.RoomJoinRules,
          content: {
            join_rule: JoinRule.Invite,
          },
        },
      ];

      try {
        const { room_id } = await matrixClient.createRoom(createOpts);
        return room_id;
      } catch (e) {
        throw e;
      }
    },
    [findExisingRoom, matrixClient],
  );

  const createNewChat = useCallback(
    async (opts: ICreateRoomOpts) => {
      try {
        const roomId = await createRoom(opts);
        const room = matrixClient.getRoom(roomId);
        if (room) {
          setRoomIdParam(room.roomId);
          return room.roomId;
        }
      } catch (error) {
        logger.error("Creating new room failed", error);
      }
    },
    [createRoom, matrixClient, setRoomIdParam],
  );

  return {
    findExisingRoom,
    createNewChat,
  };
}
