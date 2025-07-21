/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PropsWithChildren } from "react";

import { MainContentLayout, Toolbar } from "@eshg/lib-employee-portal";

import { StickyToolbarLayoutChat } from "@/lib/businessModules/chat/components/layout/StickyToolbarLayoutChat";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <StickyToolbarLayoutChat toolbar={<Toolbar title="Chat" />}>
      <MainContentLayout
        fullViewportHeight
        marginInline={{ xxs: 0, sm: 3 }}
        paddingBlock={{ xxs: 0, sm: 3 }}
      >
        {children}
      </MainContentLayout>
    </StickyToolbarLayoutChat>
  );
}
