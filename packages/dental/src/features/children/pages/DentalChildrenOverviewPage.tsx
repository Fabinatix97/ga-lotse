/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { ChildrenTable } from "@/features/children/components/childrenOverview/ChildrenTable";

export function DentalChildrenOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Zahnärztlicher Dienst" />}>
      <MainContentLayout fullViewportHeight>
        <ChildrenTable />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
