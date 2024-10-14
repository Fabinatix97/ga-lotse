/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ICreateRoomOpts,
  ICreateRoomStateEvent,
  Preset,
  Visibility,
} from "matrix-js-sdk/lib/matrix";
import { useCallback } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import {
  findDirectChat,
  getRoomNameAndCommunicationType,
} from "@/lib/businessModules/chat/shared/utils";

export const MEGOLM_ENCRYPTION_ALGORITHM = "m.megolm.v1.aes-sha2";

const createRoomInitialState = [
  {
    type: "m.room.history_visibility",
    state_key: "",
    content: {
      history_visibility: "shared",
    },
  },
  {
    type: "m.room.encryption",
    state_key: "",
    content: {
      algorithm: MEGOLM_ENCRYPTION_ALGORITHM,
    },
  },
];

export function useCreateNewChat() {
  const { matrixClient } = useChatClientContext();
  const { setRoomIdParam } = useChatSearchParams();

  const createNewDirectMessage = useCallback(
    async ({ invite }: ICreateRoomOpts) => {
      const joinedRooms = matrixClient
        .getRooms()
        .filter((room) => room.getMyMembership() === "join");
      const chatRooms = joinedRooms.map((room) =>
        getRoomNameAndCommunicationType(room),
      );
      const isDirectChat = invite?.length === 1;
      // if chat room with user already exist, then return chat room ID
      if (isDirectChat) {
        const DMUser = invite?.[0];
        const DMRoom = findDirectChat({ chatRooms, userId: DMUser });
        if (DMRoom) {
          setRoomIdParam(DMRoom.room.roomId);
          return DMRoom.room.roomId;
        }
      }
      // if there is no conversation with user, create new one and return new room ID
      try {
        const newRoom = await matrixClient.createRoom({
          invite,
          preset: Preset.PrivateChat,
          ...(isDirectChat && {
            is_direct: true,
            preset: Preset.TrustedPrivateChat,
          }),
          initial_state: [
            ...createRoomInitialState,
            ...((!isDirectChat
              ? [
                  {
                    type: "m.room.guest_access",
                    state_key: "",
                    content: {
                      guest_access: "can_join",
                    },
                  },
                ]
              : []) as ICreateRoomStateEvent[]),
          ],
        });
        setRoomIdParam(newRoom.room_id);
        return newRoom.room_id;
      } catch {}
    },
    [matrixClient, setRoomIdParam],
  );
  const createNewChatRoom = useCallback(
    async ({ invite, name }: ICreateRoomOpts) => {
      try {
        const newRoom = await matrixClient.createRoom({
          invite,
          name,
          preset: Preset.PrivateChat,
          visibility: Visibility.Private,
          initial_state: [
            ...createRoomInitialState,
            {
              type: "m.room.guest_access",
              state_key: "",
              content: {
                guest_access: "can_join",
              },
            },
          ],
        });
        setRoomIdParam(newRoom.room_id);
        return newRoom.room_id;
      } catch {}
    },
    [matrixClient, setRoomIdParam],
  );
  const findExisingRoom = useCallback(
    (userId: string) => {
      const joinedRooms = matrixClient
        .getRooms()
        .filter((room) => room.getMyMembership() === "join");
      const chatRooms = joinedRooms.map((room) =>
        getRoomNameAndCommunicationType(room),
      );

      return findDirectChat({ chatRooms, userId });
    },
    [matrixClient],
  );
  return { createNewChatRoom, createNewDirectMessage, findExisingRoom };
}
