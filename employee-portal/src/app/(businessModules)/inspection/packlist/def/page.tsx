/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PacklistDefinitionOverviewTable } from "@/lib/businessModules/inspection/components/packlistDefinition/PacklistDefinitionOverviewTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function PacklistOverview() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Packlistendefinitionen" />}>
      <MainContentLayout fullViewportHeight>
        <PacklistDefinitionOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
