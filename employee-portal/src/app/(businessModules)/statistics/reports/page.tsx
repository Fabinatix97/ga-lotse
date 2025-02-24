/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

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
