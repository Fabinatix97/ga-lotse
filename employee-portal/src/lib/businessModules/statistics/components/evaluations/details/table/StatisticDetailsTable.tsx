/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useMemo } from "react";

import { mapAttributesToFilterDefinitions } from "@/lib/businessModules/statistics/api/mapper/mapAttributesToFilterDefinitions";
import { mapFilterValuesToStatisticFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToStatisticFilters";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { StatisticDetailsTableData } from "@/lib/businessModules/statistics/api/models/statisticDetailsTableData";
import { StatisticFilter } from "@/lib/businessModules/statistics/api/models/statisticFilterType";
import { useAddFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddFilterTemplate";
import { useDeleteFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useDeleteFilterTemplate";
import { useGetFilterTemplateFilters } from "@/lib/businessModules/statistics/api/mutations/useGetFilterTemplateFilters";
import { statisticsColumns } from "@/lib/businessModules/statistics/components/evaluations/details/table/columns";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterTemplate } from "@/lib/shared/components/filterSettings/FilterTemplates";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { useFilterTemplate } from "@/lib/shared/components/filterSettings/useFilterTemplate";
import {
  Pagination,
  PaginationProps,
} from "@/lib/shared/components/pagination/Pagination";
import {
  DataTable,
  ManualSortingProps,
} from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

export interface StatisticDetailsTableProps {
  attributes: FlatAttribute[];
  tableData: StatisticDetailsTableData;
  onFiltersSubmit: (filters: StatisticFilter[]) => void;
  manualSortingProps: ManualSortingProps;
  paginationProps: PaginationProps;
  statisticId: string;
  filterTemplates: FilterTemplate[];
}

export function StatisticDetailsTable(props: StatisticDetailsTableProps) {
  const filterDefinitions = mapAttributesToFilterDefinitions(props.attributes);

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: (filterValues) => {
      props.onFiltersSubmit(
        mapFilterValuesToStatisticFilters(filterValues, props.attributes),
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
    () => statisticsColumns(props.attributes),
    [props.attributes],
  );

  return (
    <TablePage
      fullHeight
      controls={
        <ButtonBar
          left={<FilterButton {...filterSettings.filterButtonProps} />}
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
        />
      </TableSheet>
    </TablePage>
  );
}
