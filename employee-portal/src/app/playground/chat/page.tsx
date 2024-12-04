/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

import { ChatPlaygroundContent } from "./chatPlaygroundContent";

export default function ChatPlaygroundPage() {
  const { canAccessChat, userSettings } = useChat();
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Chat Playground" />}>
      <MainContentLayout>
        {canAccessChat &&
        userSettings.chatConsentAsked &&
        !userSettings.accountDeactivated ? (
          <ChatPlaygroundContent />
        ) : null}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
