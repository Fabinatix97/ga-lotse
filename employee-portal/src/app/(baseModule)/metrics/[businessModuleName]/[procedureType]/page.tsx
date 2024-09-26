/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureType } from "@eshg/employee-portal-api/base";
import { endOfToday } from "date-fns";
import { useState } from "react";

import { useTaskMetricsQuery } from "@/lib/baseModule/api/queries/taskMetrics";
import { lastXMonthsInDate } from "@/lib/baseModule/components/procedureMetrics/rangeSelectHelper";
import { routes } from "@/lib/baseModule/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";

export default function TaskMetricsPage(
  props: Readonly<{
    params: {
      businessModuleName: string;
      procedureType: ApiProcedureType;
    };
  }>,
) {
  const timeRangeEnd = endOfToday();

  const [selectedTimeRange, _setSelectedTimeRange] = useState(12);

  const timeRangeStart = lastXMonthsInDate(timeRangeEnd, selectedTimeRange);

  const procedureMetrics = useTaskMetricsQuery({
    businessModuleName: props.params.businessModuleName,
    procedureType: props.params.procedureType,
    timeRangeStart,
    timeRangeEnd,
  });

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Aufgabenkennzahlen: ${props.params.procedureType}`}
          backHref={routes.metrics.index}
        />
      }
    >
      <MainContentLayout>
        {procedureMetrics.taskMetrics.join()}
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
