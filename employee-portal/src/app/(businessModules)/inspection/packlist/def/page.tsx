/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { PacklistDefinitionOverviewTable } from "@/lib/businessModules/inspection/components/packlistDefinition/PacklistDefinitionOverviewTable";

export default function PacklistOverview() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Packlistendefinitionen" />}>
      <MainContentLayout fullViewportHeight>
        <PacklistDefinitionOverviewTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
