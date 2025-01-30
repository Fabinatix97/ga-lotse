/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiSortDirection } from "@eshg/employee-portal-api/stiProtection";
import { startTransition, useEffect, useState } from "react";
import { isDefined, isNullish } from "remeda";

import {
  isValidAttributeKey,
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

  const [sortKey, setSortKey] = useState<string>();
  const [sortDirection, setSortDirection] = useState<ApiSortDirection>();

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

  const sortableAccessorKey = evaluation.attributes.find(
    (attribute) => attribute.type !== "ProcedureReferenceAttribute",
  )?.key;

  const {
    sortKey: tableSortKey,
    sortDirection: tableSortDirection,
    manualSortingProps,
  } = useTableSorting({
    onSortingChange: () => resetPageNumber(),
    initialSorting: isDefined(sortableAccessorKey)
      ? {
          id: sortableAccessorKey,
          desc: false,
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
    loading: isNullish(sortKey),
  };

  return (
    <EvaluationDetailsLayout
      evaluationId={props.params.id}
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
