/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import { useReplaceSearchParams } from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

export function useSelectedRoomId() {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();
  const selectedRoomId = searchParams.get(chatSearchParamNames.roomId) ?? "";

  const setSelectedRoomId = useCallback(
    (roomId: string) => {
      if (!roomId) {
        return;
      }

      replaceSearchParams([
        {
          name: chatSearchParamNames.roomId,
          value: roomId,
        },
        {
          name: chatSearchParamNames.userId,
          value: "",
        },
      ]);
    },
    [replaceSearchParams],
  );

  return {
    selectedRoomId,
    setSelectedRoomId,
  };
}
