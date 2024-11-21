/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiEvaluationSortKey } from "@eshg/employee-portal-api/statistics";
import { startTransition, useState } from "react";

import { StatisticOverviewTableItem } from "@/lib/businessModules/statistics/api/models/statisticOverview";
import { useGetStatisticsOverview } from "@/lib/businessModules/statistics/api/queries/useGetStatisticsOverview";
import { CreateEvaluationSidebar } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/CreateEvaluationSidebar";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";

import { StatisticsTable } from "./StatisticsTable";

export function StatisticsOverview() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [anonymizationValue, setAnonymizationValue] = useState<boolean>();

  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const { sortKey, sortDirection, manualSortingProps } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: {
      id: "timeRangeStart",
      desc: true,
    },
  });

  const statisticSortKey: Partial<
    Record<keyof StatisticOverviewTableItem, ApiEvaluationSortKey>
  > = {
    name: "NAME",
    createdAt: "CREATED_AT",
    timeRangeStart: "TIME_RANGE_START",
    timeRangeEnd: "TIME_RANGE_END",
  };

  const {
    statisticsOverview,
    statisticsOverviewIsFetching,
    availableDataSources,
    evaluationTemplates,
  } = useGetStatisticsOverview({
    apiGetEvaluationsRequest: {
      page,
      pageSize,
      anonymizationValue,
      sortDirection,
      sortKey: statisticSortKey[sortKey as keyof StatisticOverviewTableItem],
    },
  });

  return (
    <>
      <CreateEvaluationSidebar
        apiDataSources={availableDataSources}
        apiTemplates={evaluationTemplates}
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />
      <StatisticsTable
        statisticOverview={statisticsOverview}
        loading={statisticsOverviewIsFetching}
        onCreateStatisticClick={() => setOpenSidebar(true)}
        onAnonymizedFilterChanged={(filter) => {
          startTransition(() => {
            setAnonymizationValue(filter);
            resetPageNumber();
          });
        }}
        paginationProps={getPaginationProps({
          totalCount: statisticsOverview.totalNumberOfElements,
        })}
        manualSortingProps={manualSortingProps}
      />
    </>
  );
}
