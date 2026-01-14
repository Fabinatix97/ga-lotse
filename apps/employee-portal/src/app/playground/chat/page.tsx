/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

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
