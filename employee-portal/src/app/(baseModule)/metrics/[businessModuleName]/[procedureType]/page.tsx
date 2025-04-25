/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { use } from "react";

import { ApiBusinessModule, ApiProcedureType } from "@eshg/base-api";
import {
  MainContentLayout,
  StickyToolbarLayout,
  Toolbar,
  ToolbarBackButton,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal/types/pageParams";

import { TaskMetricsDisplay } from "@/lib/baseModule/components/procedureMetrics/taskMetrics/TaskMetricsDisplay";
import { routes } from "@/lib/baseModule/shared/routes";
import { procedureTypeNames } from "@/lib/shared/components/procedures/constants";

export default function TaskMetricsPage(
  props: DynamicPageProps<{
    businessModuleName: ApiBusinessModule;
    procedureType: ApiProcedureType;
  }>,
) {
  const { businessModuleName, procedureType } = use(props.params);

  return (
    <StickyToolbarLayout
      toolbar={
        <Toolbar
          title={`Aufgabenkennzahlen: ${procedureTypeNames[procedureType]}`}
          backButton={<ToolbarBackButton href={routes.metrics.index} />}
        />
      }
    >
      <MainContentLayout>
        <TaskMetricsDisplay
          businessModuleName={businessModuleName}
          procedureType={procedureType}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
