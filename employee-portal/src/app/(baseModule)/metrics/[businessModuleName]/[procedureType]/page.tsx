/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureType } from "@eshg/employee-portal-api/base";

import { TaskMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/taskMetrics/TaskMetricsDisplay";
import { routes } from "@/lib/baseModule/shared/routes";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";

export default function TaskMetricsPage(
  props: Readonly<{
    params: { businessModuleName: string; procedureType: ApiProcedureType };
  }>,
) {
  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Aufgabenkennzahlen: ${procedureTypeNames[props.params.procedureType]}`}
          backHref={routes.metrics.index}
        />
      }
    >
      <MainContentLayout>
        <TaskMetricsDisplay
          businessModuleName={props.params.businessModuleName}
          procedureType={props.params.procedureType}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
