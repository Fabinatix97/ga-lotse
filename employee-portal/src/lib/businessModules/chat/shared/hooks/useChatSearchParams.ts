/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

export function useChatSearchParams() {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();
  const selectedRoomId = searchParams.get(chatSearchParamNames.roomId) ?? "";
  const selectedUserId = searchParams.get(chatSearchParamNames.userId) ?? "";

  const setRoomIdParam = useCallback(
    (roomId: string) => {
      replaceSearchParams([
        {
          name: chatSearchParamNames.roomId,
          value: roomId,
        },
      ]);
    },
    [replaceSearchParams],
  );

  const clearRoomIdParam = useCallback(() => {
    replaceSearchParams([
      {
        name: chatSearchParamNames.roomId,
        value: "",
      },
    ]);
  }, [replaceSearchParams]);

  const setUserIdParam = useCallback(
    (userId: string) => {
      replaceSearchParams([
        {
          name: chatSearchParamNames.userId,
          value: userId,
        },
      ]);
    },
    [replaceSearchParams],
  );

  const clearUserIdParam = useCallback(() => {
    replaceSearchParams([
      {
        name: chatSearchParamNames.userId,
        value: "",
      },
    ]);
  }, [replaceSearchParams]);

  const clearChatParams = useCallback(() => {
    replaceSearchParams([
      {
        name: chatSearchParamNames.userId,
        value: "",
      },
      {
        name: chatSearchParamNames.roomId,
        value: "",
      },
    ]);
  }, [replaceSearchParams]);

  return {
    selectedRoomId,
    selectedUserId,
    setRoomIdParam,
    setUserIdParam,
    clearRoomIdParam,
    clearUserIdParam,
    clearChatParams,
  };
}
