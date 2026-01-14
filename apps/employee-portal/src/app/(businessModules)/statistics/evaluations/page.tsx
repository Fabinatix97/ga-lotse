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
