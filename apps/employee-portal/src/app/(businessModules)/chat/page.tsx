/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { notFound } from "next/navigation";
import { useLayoutEffect } from "react";

import { LoadingIndicator } from "@eshg/lib-portal";

import { Chat } from "@/lib/businessModules/chat/components/Chat";
import { ChatErrorBoundary } from "@/lib/businessModules/chat/components/ChatErrorBoundary";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { ChatOfflineMessage } from "@/lib/businessModules/chat/components/ChatOfflineMessage";
import { DeactivationMessage } from "@/lib/businessModules/chat/components/deactivate/DeactivationMessage";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { InfoPanelProvider } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { PresenceProvider } from "@/lib/businessModules/chat/shared/PresenceProvider";

export default function ChatPage() {
  const { canAccessChat, userSettings, isSettingsLoading, isError } = useChat();

  useLayoutEffect(() => {
    if (!canAccessChat && !userSettings.accountDeactivated) {
      notFound();
    }
  }, [canAccessChat, userSettings.accountDeactivated]);

  if (isSettingsLoading) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  if (isError) {
    return <ChatOfflineMessage />;
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
