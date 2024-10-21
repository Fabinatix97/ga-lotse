/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useContext } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

export function useMatrixClient() {
  const { canAccessChat, userSettings } = useChat();
  const chatContext = useContext(ChatClientContext);

  const isChatEnabled =
    canAccessChat && userSettings.chatUsageEnabled && chatContext?.matrixClient;

  return isChatEnabled
    ? {
        client: chatContext.matrixClient,
        state: chatContext.clientState,
      }
    : null;
}
