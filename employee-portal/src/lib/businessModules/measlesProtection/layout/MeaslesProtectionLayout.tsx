/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarProps,
} from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

type MeaslesProtectionLayoutProps = RequiresChildren & ToolbarProps;
export function MeaslesProtectionLayout({
  children,
  ...toolbarProps
}: MeaslesProtectionLayoutProps) {
  return (
    <StickyToolbarLayout toolbar={<Toolbar {...toolbarProps} />}>
      <MainContentLayout>{children}</MainContentLayout>
    </StickyToolbarLayout>
  );
}
