/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EventType, HistoryVisibility } from "matrix-js-sdk/lib/matrix";
import { isNullish, isString } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { RoomWithCommunicationType } from "@/lib/businessModules/chat/shared/types";

export function useChatUtils() {
  const { configuration } = useChat();
  const { matrixClient } = useChatClientContext();
  const matrixServerUrl = configuration.MATRIX_SERVER_URL;

  async function leaveRoom(roomId: string) {
    try {
      await matrixClient.leave(roomId);
    } catch {}
  }

  function getUser(userId: string) {
    return matrixClient.getUser(userId);
  }

  function getImageUrl(url: string | undefined) {
    if (!url) {
      return null;
    }
    const isMxc = new URL(url).protocol === "mxc:";
    return isMxc ? matrixClient.mxcUrlToHttp(url) : url;
  }

  function getRoomAvatar(room: RoomWithCommunicationType | null | undefined) {
    if (isNullish(room) || !isString(matrixServerUrl)) {
      return;
    }
    if (room.communicationType === CommunicationType.PublicRoom) {
      const roomAvatarUrl =
        room.room.getAvatarUrl(matrixServerUrl, 40, 40, "scale", true) ??
        undefined;

      const imageUrl = getImageUrl(roomAvatarUrl ?? undefined) ?? undefined;
      return roomAvatarUrl ? imageUrl : undefined;
    }

    const directMessageAvatar = room.room.getAvatarFallbackMember();
    if (!directMessageAvatar) {
      return undefined;
    }
    const avatarUrl = directMessageAvatar?.getAvatarUrl(
      matrixServerUrl,
      40,
      40,
      "scale",
      true,
      false,
    );
    const imageUrl = getImageUrl(avatarUrl ?? undefined) ?? undefined;
    return avatarUrl ? imageUrl : undefined;
  }

  function invite(roomId: string, userId: string) {
    return matrixClient.invite(roomId, userId);
  }

  // Change `m.room.history_visibility`
  async function handleChangeHistoryVisibility(
    roomId: string,
    newHistoryVisibility: HistoryVisibility,
  ) {
    return matrixClient.sendStateEvent(
      roomId,
      EventType.RoomHistoryVisibility,
      {
        history_visibility: newHistoryVisibility,
      },
    );
  }

  return {
    leaveRoom,
    getRoomAvatar,
    getImageUrl,
    getUser,
    invite,
    handleChangeHistoryVisibility,
  };
}
