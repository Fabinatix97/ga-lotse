/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { EvaluationsOverview } from "@/lib/businessModules/statistics/components/evaluations/EvaluationsOverview";

export default function EvaluationsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Auswertungen" />}>
      <MainContentLayout fullViewportHeight>
        <EvaluationsOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
