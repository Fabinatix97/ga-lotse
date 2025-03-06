/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBusinessModule, ApiProcedureType } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
} from "@eshg/lib-employee-portal";

import { TaskMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/taskMetrics/TaskMetricsDisplay";
import { routes } from "@/lib/baseModule/shared/routes";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";

export default function TaskMetricsPage(
  props: Readonly<{
    params: {
      businessModuleName: ApiBusinessModule;
      procedureType: ApiProcedureType;
    };
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
