/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { startTransition, use, useEffect, useState } from "react";
import { isDefined } from "remeda";

import {
  MainContentLayout,
  usePagination,
  useTableSorting,
} from "@eshg/lib-employee-portal";
import { DynamicPageProps } from "@eshg/lib-portal";
import { ApiSortDirection } from "@eshg/statistics-api";

import {
  isValidAttributeKey,
  mapAttributeSelectionToKey,
  mapKeyToAttributeSelection,
} from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { ProcedureReferences } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableProcedureReferences";
import { EvaluationFilter } from "@/lib/businessModules/statistics/api/models/evaluationFilterType";
import { useGetEvaluationDetailsTablePage } from "@/lib/businessModules/statistics/api/queries/useGetEvaluationDetailsTablePage";
import { useGetProcedureIds } from "@/lib/businessModules/statistics/api/queries/useGetProcedureIds";
import { EvaluationDetailsLayout } from "@/lib/businessModules/statistics/components/evaluations/details/EvaluationDetailsLayout";
import {
  EvaluationDetailsTable,
  EvaluationDetailsTableProps,
} from "@/lib/businessModules/statistics/components/evaluations/details/table/EvaluationDetailsTable";

export default function EvaluationDetailsTablePage(
  props: DynamicPageProps<{ id: string }>,
) {
  const { id } = use(props.params);
  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();

  const [sortKey, setSortKey] = useState<string>();
  const [sortDirection, setSortDirection] = useState<ApiSortDirection>();

  const [filters, setFilters] = useState<EvaluationFilter[]>([]);

  const { evaluation, filterTemplates } = useGetEvaluationDetailsTablePage(
    {
      evaluationId: id,
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
    id,
  );

  const {
    sortKey: tableSortKey,
    sortDirection: tableSortDirection,
    manualSortingProps,
  } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: evaluation.sortAttribute
      ? {
          id: mapAttributeSelectionToKey(evaluation.sortAttribute),
          desc: evaluation.sortDirection === "DESC",
        }
      : undefined,
  });

  useEffect(() => {
    startTransition(() => {
      setSortKey(tableSortKey);
      setSortDirection(tableSortDirection);
    });
  }, [tableSortDirection, tableSortKey]);

  const evaluationDetailsTableProps: EvaluationDetailsTableProps = {
    attributes: evaluation.attributes,
    tableData: evaluation.tableData,
    paginationProps: getPaginationProps({
      totalCount: evaluation.totalNumberOfElements,
    }),
    manualSortingProps: manualSortingProps,
    onFiltersSubmit: (filters) =>
      // Prevent the UI from being replaced by a fallback during an update
      startTransition(() => {
        setFilters(filters);
        resetPageNumber();
      }),
    filterTemplates: filterTemplates,
  };

  return (
    <EvaluationDetailsLayout
      evaluationId={id}
      evaluationDetailsTabHeaderProps={{
        evaluationName: evaluation.evaluationName,
      }}
    >
      <MainContentLayout fullViewportHeight>
        {isDefined(evaluation.procedureReferences) ? (
          <EvaluationDetailsTableWithProcedureReferences
            procedureReferences={evaluation.procedureReferences}
            evaluationDetailsTableProps={evaluationDetailsTableProps}
          />
        ) : (
          <EvaluationDetailsTable {...evaluationDetailsTableProps} />
        )}
      </MainContentLayout>
    </EvaluationDetailsLayout>
  );
}

function EvaluationDetailsTableWithProcedureReferences({
  procedureReferences,
  evaluationDetailsTableProps,
}: {
  procedureReferences: ProcedureReferences;
  evaluationDetailsTableProps: EvaluationDetailsTableProps;
}) {
  const data = useGetProcedureIds({
    businessModule: procedureReferences.businessModule,
    procedureReferenceIds: procedureReferences.referenceIds,
  });

  return (
    <EvaluationDetailsTable
      {...evaluationDetailsTableProps}
      resolveProcedureId={data?.resolveProcedureId}
    />
  );
}
