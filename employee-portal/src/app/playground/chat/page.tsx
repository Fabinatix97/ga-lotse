/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
