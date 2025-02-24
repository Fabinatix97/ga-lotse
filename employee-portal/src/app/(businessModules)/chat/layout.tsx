/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
import { PropsWithChildren } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Chat" />}>
      <MainContentLayout fullViewportHeight>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
