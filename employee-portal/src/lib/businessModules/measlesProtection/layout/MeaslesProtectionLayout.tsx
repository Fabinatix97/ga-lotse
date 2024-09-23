/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar, ToolbarProps } from "@/lib/shared/components/layout/Toolbar";

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
