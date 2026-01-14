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

import { ProcedureMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/ProcedureMetricsDisplay";

export default function ProcedureMetricsPage() {
  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Kennzahlen" />}>
      <MainContentLayout>
        <ProcedureMetricsDisplay />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
