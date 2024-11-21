/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { startTransition, useState } from "react";
import { isDefined } from "remeda";

import {
  isValidAttributeKey,
  mapKeyToAttributeSelection,
} from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { StatisticFilter } from "@/lib/businessModules/statistics/api/models/statisticFilterType";
import { useGetStatisticDetailsTablePage } from "@/lib/businessModules/statistics/api/queries/useGetStatisticDetailsTablePage";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { StatisticDetailsTable } from "@/lib/businessModules/statistics/components/evaluations/details/table/StatisticDetailsTable";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useTableSorting } from "@/lib/shared/hooks/table/useTableSorting";

export default function EvaluationDetailsTablePage(
  props: Readonly<{
    params: { id: string };
  }>,
) {
  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();
  const { sortKey, sortDirection, manualSortingProps } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
  });

  const [filters, setFilters] = useState<StatisticFilter[]>([]);

  const { statistic, filterTemplates } = useGetStatisticDetailsTablePage(
    {
      evaluationId: props.params.id,
      apiGetEvaluationRequest: {
        page,
        pageSize,
        sortAttribute:
          isDefined(sortKey) && isValidAttributeKey(sortKey)
            ? mapKeyToAttributeSelection(sortKey)
            : undefined,
        sortDirection,
        filters,
      },
    },
    props.params.id,
  );

  return (
    <EvaluationDetailsLayout
      statisticId={props.params.id}
      statisticDetailsTabHeaderProps={{
        statisticName: statistic.statisticName,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <StatisticDetailsTable
          statisticId={props.params.id}
          attributes={statistic.attributes}
          tableData={statistic.tableData}
          paginationProps={getPaginationProps({
            totalCount: statistic.totalNumberOfElements,
          })}
          manualSortingProps={manualSortingProps}
          onFiltersSubmit={(filters) =>
            // Prevent the UI from being replaced by a fallback during an update
            startTransition(() => {
              setFilters(filters);
              resetPageNumber();
            })
          }
          filterTemplates={filterTemplates}
        />
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}
