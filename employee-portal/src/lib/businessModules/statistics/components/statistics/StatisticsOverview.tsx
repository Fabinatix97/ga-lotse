/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiAvailableDataSource,
  ApiGetStatisticsResponse,
  ApiStatisticsScheme,
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
  schemes: ApiStatisticsScheme[];
}

export function StatisticsOverview({
  statisticsResponse,
  isFetchingStatistics,
  dataSources,
  schemes,
}: StatisticsOverviewProps) {
  const [openSidebar, setOpenSidebar] = useState<OpenSidebarKind>("NONE");

  return (
    <>
      <CreateStatisticSidebar
        apiDataSources={dataSources}
        apiSchemes={schemes}
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
