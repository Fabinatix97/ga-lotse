/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useContext, useMemo } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { usePresence } from "@/lib/businessModules/chat/shared/hooks/usePresence";
import { Presence } from "@/lib/businessModules/chat/shared/types";

export function useGetSelfUserPresence() {
  const { canAccessChat, userSettings } = useChat();
  const { matrixClient } = useContext(ChatClientContext) ?? {};
  const loggedInUserId = matrixClient?.getUserId();
  const { usersPresence } = usePresence(loggedInUserId ?? undefined);

  const isChatEnabled =
    canAccessChat &&
    userSettings.chatUsageEnabled &&
    matrixClient &&
    !userSettings.accountDeactivated;

  return useMemo(() => {
    let userPresence: Presence | undefined = undefined;
    const sharePresence = userSettings.sharePresence;

    if (isChatEnabled) {
      if (userSettings.sharePresence) {
        userPresence = usersPresence[loggedInUserId ?? ""];
      }
    }
    return {
      userPresence,
      sharePresence: sharePresence && isChatEnabled,
    };
  }, [
    isChatEnabled,
    loggedInUserId,
    userSettings.sharePresence,
    usersPresence,
  ]);
}
