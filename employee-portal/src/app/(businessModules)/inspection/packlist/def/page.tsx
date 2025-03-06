/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

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
