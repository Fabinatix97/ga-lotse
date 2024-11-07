/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAvailableDataSource,
  ApiEvaluationTemplate,
} from "@eshg/employee-portal-api/statistics";
import { useState } from "react";

import { StatisticOverview } from "@/lib/businessModules/statistics/api/models/statisticOverview";
import {
  CreateStatisticSidebar,
  OpenSidebarKind,
} from "@/lib/businessModules/statistics/components/statistics/CreateStatisticSidebar/CreateStatisticSidebar";

import { StatisticsTable } from "./StatisticsTable";

export interface StatisticsOverviewProps {
  statisticsOverview: StatisticOverview;
  isFetchingStatisticsOverview: boolean;
  dataSources: ApiAvailableDataSource[];
  templates: ApiEvaluationTemplate[];
}

export function StatisticsOverview({
  statisticsOverview,
  isFetchingStatisticsOverview,
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
        statisticOverview={statisticsOverview}
        loading={isFetchingStatisticsOverview}
        onCreateStatisticClick={() => setOpenSidebar("FROM_SCRATCH")}
      />
    </>
  );
}
