/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { EvaluationsOverview } from "@/lib/businessModules/statistics/components/evaluations/EvaluationsOverview";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function EvaluationsOverviewPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Auswertungen" />}>
      <MainContentLayout fullViewportHeight>
        <EvaluationsOverview />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
