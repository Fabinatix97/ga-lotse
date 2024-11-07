/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useContext, useMemo } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { Presence } from "@/lib/businessModules/chat/shared/types";

export function useGetSelfUserPresence() {
  const { canAccessChat, userSettings } = useChat();
  const chatContext = useContext(ChatClientContext);

  const isChatEnabled =
    canAccessChat && userSettings.chatUsageEnabled && chatContext?.matrixClient;

  return useMemo(() => {
    let userId: string | null = null;
    let userPresence: Presence | undefined = undefined;
    const sharePresence = userSettings.sharePresence;

    if (isChatEnabled) {
      userId = chatContext.matrixClient.getUserId();

      if (userSettings.sharePresence) {
        userPresence = chatContext.usersPresence[userId ?? ""];
      }
    }
    return {
      userId,
      userPresence,
      sharePresence: sharePresence && isChatEnabled,
    };
  }, [
    chatContext?.matrixClient,
    chatContext?.usersPresence,
    isChatEnabled,
    userSettings.sharePresence,
  ]);
}
