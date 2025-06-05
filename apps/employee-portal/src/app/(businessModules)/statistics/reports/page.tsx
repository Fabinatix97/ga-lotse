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

import { ReportsOverview } from "@/lib/businessModules/statistics/components/reports/ReportsOverview";

export default function ReportsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Reports" />}>
      <MainContentLayout fullViewportHeight>
        <ReportsOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
