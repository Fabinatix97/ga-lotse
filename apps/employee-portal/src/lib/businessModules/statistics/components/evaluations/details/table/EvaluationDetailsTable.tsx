/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useMemo } from "react";
import { isDefined } from "remeda";

import {
  ButtonBar,
  DataTable,
  FilterSettings,
  FilterSettingsSheet,
  FilterTemplate,
  ManualTableSortingProps,
  Pagination,
  PaginationProps,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useFilterSettings,
} from "@eshg/lib-employee-portal";

import { resolveProcedureDetailsRoute } from "@/lib/baseModule/moduleRegister/routeResolver";
import { mapAttributesToFilterDefinitions } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToFilterDefinitions";
import { mapFilterValuesToEvaluationFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToEvaluationFilters";
import { EvaluationDetailsTableData } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import { EvaluationFilter } from "@/lib/businessModules/statistics/api/models/evaluationFilterType";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { useAddFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddFilterTemplate";
import { useDeleteFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteFilterTemplate";
import { useGetFilterTemplateFilters } from "@/lib/businessModules/statistics/api/mutations/useGetFilterTemplateFilters";
import { evaluationColumns } from "@/lib/businessModules/statistics/components/evaluations/details/table/columns";
import { useFilterTemplate } from "@/lib/shared/components/filterSettings/useFilterTemplate";

export interface EvaluationDetailsTableProps {
  attributes: FlatAttribute[];
  tableData: EvaluationDetailsTableData;
  onFiltersSubmit: (filters: EvaluationFilter[]) => void;
  manualSortingProps: ManualTableSortingProps;
  paginationProps: PaginationProps;
  filterTemplates: FilterTemplate[];
  resolveProcedureId?: (
    procedureReferenceId: string | undefined,
  ) => string | undefined;
}

export function EvaluationDetailsTable(props: EvaluationDetailsTableProps) {
  const filterDefinitions = mapAttributesToFilterDefinitions(props.attributes);

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: (filterValues) => {
      props.onFiltersSubmit(
        mapFilterValuesToEvaluationFilters(filterValues, props.attributes),
      );
    },
  });

  const addFilterTemplate = useAddFilterTemplate(props.attributes);
  const deleteFilterTemplate = useDeleteFilterTemplate();
  const getFilterTemplateFilters = useGetFilterTemplateFilters();
  const filterTemplateProps = useFilterTemplate({
    addFilterTemplate: addFilterTemplate,
    deleteFilterTemplate: deleteFilterTemplate,
    getFilterTemplateFilters: getFilterTemplateFilters,
    onActiveFilterValuesChanged: filterSettings.onActiveFilterValuesChanged,
    filterTemplates: props.filterTemplates,
    setOnActiveFilterValuesChangedCallback:
      filterSettings.setOnActiveFilterValuesChangedCallback,
  });

  const columns = useMemo(
    () =>
      evaluationColumns({
        flatAttributes: props.attributes,
      }),
    [props.attributes],
  );

  const procedureReferenceAttribute = props.attributes.find(
    (attribute) => attribute.type === "ProcedureReferenceAttribute",
  );

  const focusColumnAccessorKey = props.attributes.find(
    (attribute) => attribute.type !== "ProcedureReferenceAttribute",
  )!.key;

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={<ToggleFilterButton {...filterSettings.filterButtonProps} />}
        />
      }
      filterSettings={
        filterSettings.filterSettingsVisible && (
          <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
            <FilterSettings
              {...filterSettings.filterSettingsProps}
              filterTemplatesProps={filterTemplateProps}
            />
          </FilterSettingsSheet>
        )
      }
    >
      <TableSheet footer={<Pagination {...props.paginationProps} />}>
        <DataTable
          wrapContent
          wrapHeader
          data={props.tableData}
          columns={columns}
          sorting={props.manualSortingProps}
          enableSortingRemoval={false}
          rowNavigation={{
            onClick: (row) => {
              if (
                isDefined(procedureReferenceAttribute) &&
                isDefined(props.resolveProcedureId)
              ) {
                const procedureReferenceId = row.original[
                  procedureReferenceAttribute.key
                ] as string | undefined;
                const procedureId =
                  props.resolveProcedureId(procedureReferenceId);
                if (isDefined(procedureId)) {
                  return () =>
                    window.open(
                      resolveProcedureDetailsRoute({
                        businessModule:
                          procedureReferenceAttribute.businessModule,
                        procedureId,
                      }),
                      "_blank",
                    );
                }
              }
            },
            focusColumnAccessorKey,
          }}
        />
      </TableSheet>
    </TablePage>
  );
}
