/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { startTransition, useState } from "react";
import { isDefined } from "remeda";

import {
  isValidAttributeKey,
  mapKeyToAttributeSelection,
} from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { EvaluationFilter } from "@/lib/businessModules/statistics/api/models/evaluationFilterType";
import { useGetEvaluationDetailsTablePage } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationDetailsTablePage";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import { EvaluationDetailsTable } from "@/lib/businessModules/statistics/components/evaluations/details/table/EvaluationDetailsTable";
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

  const [filters, setFilters] = useState<EvaluationFilter[]>([]);

  const { evaluation, filterTemplates } = useGetEvaluationDetailsTablePage(
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
      evaluationId={props.params.id}
      evaluationDetailsTabHeaderProps={{
        evaluationName: evaluation.evaluationName,
      }}
    >
      <MainContentLayout fullViewportHeight>
        <EvaluationDetailsTable
          evaluationId={props.params.id}
          attributes={evaluation.attributes}
          tableData={evaluation.tableData}
          paginationProps={getPaginationProps({
            totalCount: evaluation.totalNumberOfElements,
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
