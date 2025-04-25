/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { startTransition, useState } from "react";

import {
  ButtonBar,
  DataTable,
  FilterSettings,
  FilterSettingsSheet,
  FilterValue,
  NoSearchResults,
  Pagination,
  TablePage,
  TableSheet,
  ToggleFilterButton,
  useFilterSettings,
  usePagination,
} from "@eshg/lib-employee-portal";

import { useExportReportData } from "@/lib/businessModules/statistics/api/downloads/useExportReportData";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { ReportOverviewTableRow } from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";
import { useGetReportsOverview } from "@/lib/businessModules/statistics/api/queries/useGetReportsOverview";
import { createFilterDefinitions } from "@/lib/businessModules/statistics/components/reports/filterDefinitions";
import { useDeleteWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteWithConfirmation";
import { useDataExportGuard } from "@/lib/businessModules/statistics/components/shared/hooks/useDataExportGuard";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { getReportsOverviewColumns } from "./columns";

export function ReportsOverview() {
  const copy = useCopy();

  const { deleteReportWithConfirmation, deleteReportSeriesWithConfirmation } =
    useDeleteWithConfirmation();
  const { download: exportData } = useExportReportData();
  const userPermissions = useStatisticsRoleChecks();

  const { resetPageNumber, page, pageSize, getPaginationProps } =
    usePagination();

  const [filterValues, setFilterValues] = useState<FilterValue[]>([]);

  const { dataSources, reportsOverview } = useGetReportsOverview(
    {
      page,
      pageSize,
      sortDirection: undefined,
      sortKey: undefined,
    },
    filterValues,
  );
  const dataExportGuard = useDataExportGuard();

  const filterSettings = useFilterSettings({
    definitions: createFilterDefinitions(dataSources),
    onValuesSubmit: (filterValues) => {
      startTransition(() => {
        setFilterValues(filterValues);
        resetPageNumber();
      });
    },
    showSearch: false,
  });

  const paginationProps = getPaginationProps({
    totalCount: reportsOverview.totalNumberOfElements,
  });

  function getSubRows(item: ReportOverviewTableRow) {
    return item.type === "SERIES" ? item.subRows : undefined;
  }

  return (
    <TablePage
      data-testid="evaluations-reports-overview-table"
      fullHeight
      controls={
        <ButtonBar
          left={<ToggleFilterButton {...filterSettings.filterButtonProps} />}
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
          striped={false}
          wrapContent
          columns={getReportsOverviewColumns(
            copy,
            deleteReportWithConfirmation,
            deleteReportSeriesWithConfirmation,
            async (item) =>
              dataExportGuard(item.dataSensitivity, () =>
                exportData(
                  { reportId: item.reportId },
                  { tooMuchDataForExport: item.tooMuchDataForExport },
                ),
              ),
            userPermissions.canWrite(),
            userPermissions.canDelete,
          )}
          data={reportsOverview.reports}
          noDataComponent={() => (
            <Box flex={1} alignContent="center">
              <NoSearchResults info="Keine Reports vorhanden" />
            </Box>
          )}
          rowNavigation={{
            route: (row) =>
              // For Reports overview, only completed reports are shown
              row.original.type !== ReportDataType.Series
                ? routes.reports.details(row.original.reportId).index
                : undefined,
            focusColumnAccessorKey: "name",
          }}
          getSubRows={getSubRows}
        />
      </TableSheet>
    </TablePage>
  );
}
