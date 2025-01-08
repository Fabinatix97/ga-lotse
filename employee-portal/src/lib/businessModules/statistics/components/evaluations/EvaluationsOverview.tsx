/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { startTransition, useState } from "react";

import { useGetEvaluationsOverview } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationsOverview";
import { useCreateEvaluationSidebar } from "@/lib/businessModules/statistics/components/evaluations/CreateEvaluationSidebar/CreateEvaluationSidebar";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";

import { EvaluationsTable } from "./EvaluationsTable";

export function EvaluationsOverview() {
  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);

  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const { sortKey, sortDirection, manualSortingProps } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: {
      id: "timeRangeStart",
      desc: true,
    },
  });
  const createEvaluationSidebar = useCreateEvaluationSidebar();

  const {
    evaluationsOverview,
    evaluationsOverviewIsFetching,
    availableDataSources,
    evaluationTemplates,
  } = useGetEvaluationsOverview(
    {
      page,
      pageSize,
      sortDirection,
      sortKey,
    },
    filterValues,
  );

  function openCreateEvaluationSidebar() {
    createEvaluationSidebar.open({
      apiDataSources: availableDataSources,
      apiTemplates: evaluationTemplates,
    });
  }

  return (
    <EvaluationsTable
      apiDataSources={availableDataSources}
      evaluationOverview={evaluationsOverview}
      loading={evaluationsOverviewIsFetching}
      onCreateEvaluationClick={openCreateEvaluationSidebar}
      onFilterValuesChanged={(filterValues) => {
        startTransition(() => {
          setFilterValues(filterValues);
          resetPageNumber();
        });
      }}
      paginationProps={getPaginationProps({
        totalCount: evaluationsOverview.totalNumberOfElements,
      })}
      manualSortingProps={manualSortingProps}
    />
  );
}
