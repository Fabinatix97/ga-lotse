/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiEvaluationSortKey } from "@eshg/employee-portal-api/statistics";
import { startTransition, useState } from "react";

import { EvaluationOverviewTableItem } from "@/lib/businessModules/statistics/api/models/evaluationOverview";
import { useGetEvaluationsOverview } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationsOverview";
import { CreateEvaluationSidebar } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/CreateEvaluationSidebar";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";

import { EvaluationsTable } from "./EvaluationsTable";

export function EvaluationsOverview() {
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

  const evaluationSortKey: Partial<
    Record<keyof EvaluationOverviewTableItem, ApiEvaluationSortKey>
  > = {
    name: "NAME",
    createdAt: "CREATED_AT",
    timeRangeStart: "TIME_RANGE_START",
    timeRangeEnd: "TIME_RANGE_END",
  };

  const {
    evaluationsOverview,
    evaluationsOverviewIsFetching,
    availableDataSources,
    evaluationTemplates,
  } = useGetEvaluationsOverview({
    apiGetEvaluationsRequest: {
      page,
      pageSize,
      anonymizationValue,
      sortDirection,
      sortKey: evaluationSortKey[sortKey as keyof EvaluationOverviewTableItem],
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
      <EvaluationsTable
        evaluationOverview={evaluationsOverview}
        loading={evaluationsOverviewIsFetching}
        onCreateEvaluationClick={() => setOpenSidebar(true)}
        onAnonymizedFilterChanged={(filter) => {
          startTransition(() => {
            setAnonymizationValue(filter);
            resetPageNumber();
          });
        }}
        paginationProps={getPaginationProps({
          totalCount: evaluationsOverview.totalNumberOfElements,
        })}
        manualSortingProps={manualSortingProps}
      />
    </>
  );
}
