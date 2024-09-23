/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { endOfToday } from "date-fns";
import { startTransition, useState } from "react";

import { useAggregateProcedureMetricsQuery } from "@/lib/baseModule/api/queries/procedures";
import { ProcedureMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/ProcedureMetricsDisplay";
import { lastXMonthsInDate } from "@/lib/baseModule/components/procedureMetrics/rangeSelectHelper";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function ProcedureMetricsPage() {
  const today = endOfToday();

  const [selectedTimeRange, setSelectedTimeRange] = useState(12);

  const { data: procedureMetrics } = useAggregateProcedureMetricsQuery({
    timeRangeStart: lastXMonthsInDate(today, selectedTimeRange),
    timeRangeEnd: today,
  });

  return (
    <StickyToolbarLayout toolbar={<Toolbar title={"Kennzahlen"} />}>
      <MainContentLayout>
        <ProcedureMetricsDisplay
          procedureMetrics={procedureMetrics}
          setSelectedTimeRange={(range) => {
            startTransition(() => {
              setSelectedTimeRange(range);
            });
          }}
          selectedTimeRange={selectedTimeRange}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
