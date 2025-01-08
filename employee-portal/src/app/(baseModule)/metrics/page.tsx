/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ProcedureMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/ProcedureMetricsDisplay";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ProcedureMetricsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Kennzahlen"} />}>
      <MainContentLayout>
        <ProcedureMetricsDisplay />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
