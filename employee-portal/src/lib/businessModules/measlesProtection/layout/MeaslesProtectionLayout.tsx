/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import {
  Toolbar,
  ToolbarProps,
} from "@eshg/lib-employee-portal/components/toolbar/Toolbar";
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
