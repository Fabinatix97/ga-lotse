/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useReplaceSearchParams } from "@eshg/lib-employee-portal";

import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";

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
        {
          name: chatSearchParamNames.userId,
          value: undefined,
        },
      ]);
    },
    [replaceSearchParams],
  );

  const clearRoomIdParam = useCallback(() => {
    replaceSearchParams([
      {
        name: chatSearchParamNames.roomId,
        value: undefined,
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
        value: undefined,
      },
    ]);
  }, [replaceSearchParams]);

  const clearChatParams = useCallback(() => {
    replaceSearchParams([
      {
        name: chatSearchParamNames.userId,
        value: undefined,
      },
      {
        name: chatSearchParamNames.roomId,
        value: undefined,
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
