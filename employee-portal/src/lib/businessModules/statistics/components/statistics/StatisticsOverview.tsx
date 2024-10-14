/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAvailableDataSource,
  ApiEvaluationTemplate,
  ApiGetStatisticsResponse,
} from "@eshg/employee-portal-api/statistics";
import { useState } from "react";

import {
  CreateStatisticSidebar,
  OpenSidebarKind,
} from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/CreateStatisticSidebar";

import { StatisticsTable } from "./StatisticsTable";

export interface StatisticsOverviewProps {
  statisticsResponse: ApiGetStatisticsResponse;
  isFetchingStatistics: boolean;
  dataSources: ApiAvailableDataSource[];
  templates: ApiEvaluationTemplate[];
}

export function StatisticsOverview({
  statisticsResponse,
  isFetchingStatistics,
  dataSources,
  templates,
}: StatisticsOverviewProps) {
  const [openSidebar, setOpenSidebar] = useState<OpenSidebarKind>("NONE");

  return (
    <>
      <CreateStatisticSidebar
        apiDataSources={dataSources}
        apiTemplates={templates}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
      <StatisticsTable
        data={statisticsResponse}
        loading={isFetchingStatistics}
        onTemplateClick={() => setOpenSidebar("FROM_TEMPLATE")}
        onCreateStatisticClick={() => setOpenSidebar("FROM_SCRATCH")}
      />
    </>
  );
}
