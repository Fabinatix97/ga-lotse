/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { EmployeeSelfStatisticsPage } from "@/lib/businessModules/schoolEntry/features/employeeSelfStatistics/EmployeeSelfStatisticsPage";

export default function LabelsOverviewPage() {
  return (
    <StickyToolbarLayout
      toolbar={<Toolbar title="Mitarbeiteruntersuchungsstatistik" />}
    >
      <MainContentLayout>
        <EmployeeSelfStatisticsPage />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
