/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";

import { Chat } from "@/lib/businessModules/chat/components/Chat";
import { ChatFeatureUnavailable } from "@/lib/businessModules/chat/components/ChatFeatureUnavailable";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

export default function ChatPage() {
  const {
    canAccessChat,
    userSettings,
    isSettingsLoading,
    isFeatureToggleLoading,
  } = useChat();

  if (isFeatureToggleLoading) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  if (!canAccessChat) {
    return <ChatFeatureUnavailable />;
  }

  if (isSettingsLoading) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  return userSettings.chatUsageEnabled ? <Chat /> : <ChatNoAccessAlert />;
}
