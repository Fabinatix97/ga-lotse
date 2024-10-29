/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import { notFound } from "next/navigation";
import { useLayoutEffect } from "react";

import { Chat } from "@/lib/businessModules/chat/components/Chat";
import { ChatErrorBoundary } from "@/lib/businessModules/chat/components/ChatErrorBoundary";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { InfoPanelProvider } from "@/lib/businessModules/chat/shared/InfoPanelProvider";

export default function ChatPage() {
  const {
    canAccessChat,
    userSettings,
    isSettingsLoading,
    isFeatureToggleLoading,
    isFeatureToggleSuccess,
  } = useChat();

  useLayoutEffect(() => {
    if (!canAccessChat && isFeatureToggleSuccess) {
      notFound();
    }
  }, [canAccessChat, isFeatureToggleSuccess]);

  if (isFeatureToggleLoading || isSettingsLoading) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  return userSettings.chatUsageEnabled ? (
    <ChatErrorBoundary>
      <InfoPanelProvider>
        <Chat />
      </InfoPanelProvider>
    </ChatErrorBoundary>
  ) : (
    <ChatNoAccessAlert />
  );
}
