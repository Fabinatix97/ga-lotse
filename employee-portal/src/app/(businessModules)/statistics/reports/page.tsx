/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ReportsOverview } from "@/lib/businessModules/statistics/components/reports/ReportsOverview";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ReportsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Reports" />}>
      <MainContentLayout fullViewportHeight>
        <ReportsOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
