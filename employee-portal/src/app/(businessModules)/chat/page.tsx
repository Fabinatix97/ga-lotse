/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { notFound } from "next/navigation";
import { useLayoutEffect } from "react";

import { LoadingIndicator } from "@eshg/lib-portal";

import { Chat } from "@/lib/businessModules/chat/components/Chat";
import { ChatErrorBoundary } from "@/lib/businessModules/chat/components/ChatErrorBoundary";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { DeactivationMessage } from "@/lib/businessModules/chat/components/deactivate/DeactivationMessage";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { InfoPanelProvider } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { PresenceProvider } from "@/lib/businessModules/chat/shared/PresenceProvider";

export default function ChatPage() {
  const {
    canAccessChat,
    userSettings,
    isSettingsLoading,
    isFeatureToggleLoading,
    isFeatureToggleSuccess,
  } = useChat();

  useLayoutEffect(() => {
    if (
      !canAccessChat &&
      isFeatureToggleSuccess &&
      !userSettings.accountDeactivated
    ) {
      notFound();
    }
  }, [canAccessChat, isFeatureToggleSuccess, userSettings.accountDeactivated]);

  if (isFeatureToggleLoading || isSettingsLoading) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  if (userSettings.accountDeactivated) {
    return <DeactivationMessage />;
  }

  return userSettings.chatUsageEnabled ? (
    <ChatErrorBoundary>
      <InfoPanelProvider>
        <PresenceProvider>
          <Chat />
        </PresenceProvider>
      </InfoPanelProvider>
    </ChatErrorBoundary>
  ) : (
    <ChatNoAccessAlert />
  );
}
