/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiSortDirection,
  ApiStatisticSortKey,
  GetStatisticsRequest,
} from "@eshg/employee-portal-api/statistics";

import { useGetStatisticsOverviewPage } from "@/lib/businessModules/statistics/api/queries/useGetStatisticsOverviewPage";
import { StatisticsOverview } from "@/lib/businessModules/statistics/components/statistics/StatisticsOverview";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import {
  SearchParams,
  parseOptionalEnum,
  parsePageParams,
} from "@/lib/shared/helpers/searchParams";

function parseSearchParams(searchParams: SearchParams): GetStatisticsRequest {
  const { pageSize, pageNumber } = parsePageParams(searchParams);
  return {
    apiGetStatisticsRequest: {
      sortKey: parseOptionalEnum(ApiStatisticSortKey, searchParams.sortKey),
      sortDirection: parseOptionalEnum(
        ApiSortDirection,
        searchParams.sortDirection,
      ),
      page: pageNumber,
      pageSize,
    },
  };
}

export default function StatisticsOverviewPage(props: {
  searchParams: SearchParams;
}) {
  const params = parseSearchParams(props.searchParams);
  const {
    statisticsOverview,
    statisticsOverviewIsFetching,
    availableDataSources,
    evaluationTemplates,
  } = useGetStatisticsOverviewPage(params);

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Auswertungen" />}>
      <MainContentLayout fullViewportHeight>
        <StatisticsOverview
          statisticsOverview={statisticsOverview}
          isFetchingStatisticsOverview={statisticsOverviewIsFetching}
          dataSources={availableDataSources}
          templates={evaluationTemplates}
        />
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}
