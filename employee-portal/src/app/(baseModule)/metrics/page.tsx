/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@eshg/lib-employee-portal/components/layout/StickyToolbarLayout";
import { Toolbar } from "@eshg/lib-employee-portal/components/toolbar/Toolbar";

import { ProcedureMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/ProcedureMetricsDisplay";

export default function ProcedureMetricsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Kennzahlen"} />}>
      <MainContentLayout>
        <ProcedureMetricsDisplay />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
