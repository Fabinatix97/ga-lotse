/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";
import { PropsWithChildren } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Chat" />}>
      <MainContentLayout fullViewportHeight>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
