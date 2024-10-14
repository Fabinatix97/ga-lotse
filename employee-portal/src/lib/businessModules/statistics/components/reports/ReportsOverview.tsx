/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiReportType } from "@eshg/employee-portal-api/statistics";
import { Box } from "@mui/joy";
import { startTransition, useState } from "react";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/statisticReports";
import { useGetReportsOverview } from "@/lib/businessModules/statistics/api/queries/useGetReportsOverview";
import { useDeleteReportWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteReportWithConfirmation";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { FilterButton } from "@/lib/shared/components/buttons/FilterButton";
import { FilterSettings } from "@/lib/shared/components/filterSettings/FilterSettings";
import { FilterSettingsSheet } from "@/lib/shared/components/filterSettings/FilterSettingsSheet";
import { FilterDefinition } from "@/lib/shared/components/filterSettings/models/FilterDefinition";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";
import { useFilterSettings } from "@/lib/shared/components/filterSettings/useFilterSettings";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { usePagination } from "@/lib/shared/hooks/table/usePagination";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { getId, getReportsOverviewColumns } from "./columns";

function mapFilterValuesToReportsFilter(filterValues: FilterValue[]): string[] {
  return filterValues.map((filterValue) => {
    switch (filterValue.type) {
      case "EnumSingle":
        return filterValue.selectedValue;
      default:
        throw new Error(`FilterValue of type ${filterValue.type} not expected`);
    }
  });
}

const filterDefinitions: FilterDefinition[] = [
  {
    type: "EnumSingle",
    key: "report-type",
    name: "Report-Typ",
    options: [
      {
        label: translateReportType[ReportDataType.Series],
        value: ApiReportType.Auto,
      },
      {
        label: translateReportType[ReportDataType.Single],
        value: ApiReportType.Manual,
      },
    ],
    placeholder: "Bitte auswählen",
  },
];

export function ReportsOverview() {
  const copy = useCopy();

  const deleteReportWithConfirmation = useDeleteReportWithConfirmation();
  const userPermissions = useStatisticRoleChecks();

  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();

  const [reportTypeFilter, setReportTypeFilter] = useState<ApiReportType>();

  const reportsOverview = useGetReportsOverview({
    page,
    pageSize,
    reportTypeFilter,
  });

  function onFilterSubmit(reportType: ApiReportType) {
    startTransition(() => {
      setReportTypeFilter(reportType);
      resetPageNumber();
    });
  }

  const filterSettings = useFilterSettings({
    definitions: filterDefinitions,
    onValuesSubmit: (filterValues) => {
      onFilterSubmit(
        mapFilterValuesToReportsFilter(filterValues)[0] as ApiReportType,
      );
    },
  });

  const paginationProps = getPaginationProps({
    totalCount: reportsOverview.totalNumberOfElements,
  });

  return (
    <TablePage
      data-testid="statistics-reports-overview-table"
      fullHeight
      controls={
        <ButtonBar
          left={<FilterButton {...filterSettings.filterButtonProps} />}
        />
      }
      filterSettings={
        filterSettings.filterSettingsVisible && (
          <FilterSettingsSheet {...filterSettings.filterSettingsSheetProps}>
            <FilterSettings {...filterSettings.filterSettingsProps} />
          </FilterSettingsSheet>
        )
      }
    >
      <TableSheet footer={<Pagination {...paginationProps} />}>
        <DataTable
          wrapContent
          wrapHeader
          columns={getReportsOverviewColumns(
            copy,
            deleteReportWithConfirmation,
            userPermissions.canWrite(),
            userPermissions.canDelete,
          )}
          data={reportsOverview.reports}
          noDataComponent={() => (
            <Box flex={1} alignContent="center">
              <NoSearchResults info="Keine Reports vorhanden" />
            </Box>
          )}
          rowNavRoute={(row) =>
            routes.reports.details(getId(row.original)).index
          }
        />
      </TableSheet>
    </TablePage>
  );
}
