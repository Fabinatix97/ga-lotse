/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiReportState,
  ApiStatisticState,
} from "@eshg/employee-portal-api/statistics";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import { ReportSeriesState } from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import {
  ReportDataType,
  ReportSeries,
  ReportSeriesItem,
  ReportTableRow,
  SingleReport,
  StatisticReports as StatisticReportsType,
} from "@/lib/businessModules/statistics/api/models/statisticReports";
import { useDeactivateReportSeries } from "@/lib/businessModules/statistics/api/mutations/useDeactivateReportSeries";
import { getStatisticReportsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import {
  getReportActionItems,
  getSharedURL,
} from "@/lib/businessModules/statistics/components/reports/getReportActionItems";
import { useDeleteWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteWithConfirmation";
import { ReportStateChip } from "@/lib/businessModules/statistics/components/statistics/ReportStateChip";
import { AddReportSidebar } from "@/lib/businessModules/statistics/components/statistics/details/reports/AddReportSidebar/AddReportSidebar";
import {
  UpdateReportSidebar,
  UpdateReportSidebarReportInfo,
} from "@/lib/businessModules/statistics/components/statistics/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { useStatisticRoleChecks } from "@/lib/businessModules/statistics/components/statistics/useStatisticRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { AutomateReportSidebar } from "./AutomateReportSidebar/AutomateReportSidebar";
import { ReportAutomationTile } from "./ReportAutomationTile";
import { ReportSeriesStateChip } from "./ReportSeriesStateChip";

const columnHelper = createColumnHelper<ReportTableRow>();

const meta = {
  canNavigate: {
    parentRow: true,
    subRow: true,
  },
  width: "10rem",
};

function columns(
  deleteReportWithConfirmation: (reportId: string) => void,
  deleteReportSeriesWithConfirmation: (seriesId: string) => void,
  updateReport: (report: UpdateReportSidebarReportInfo) => void,
  share: (id: string) => Promise<void>,
  canDelete: (creatorUserId: string) => boolean,
  canWrite: () => boolean,
) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => props.getValue(),
      meta,
    }),
    columnHelper.accessor("timeRangeStart", {
      header: "Zeitraum Start",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta,
    }),
    columnHelper.accessor("timeRangeEnd", {
      header: "Zeitraum Ende",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta,
    }),
    columnHelper.accessor("datasetAmount", {
      header: "Datensätze",
      cell: (props) => props.getValue()!,
      meta,
    }),
    columnHelper.accessor("type", {
      header: "Report-Typ",
      cell: (props) => translateReportType[props.getValue()],
      meta,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) =>
        props.row.original.type === ReportDataType.Series ? (
          <ReportSeriesStateChip
            value={props.getValue() as ReportSeriesState}
          />
        ) : (
          <ReportStateChip value={props.getValue() as ApiReportState} />
        ),
      meta: {
        canNavigate: {
          parentRow: true,
          subRow: true,
        },
        width: "8rem",
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      enableSorting: false,
      cell: (props) => {
        const data = props.row.original;
        return props.row.original.type === ReportDataType.Series ||
          props.row.original.status === ApiReportState.Completed ? (
          <ActionsMenu
            actionItems={getReportActionItems(
              [
                {
                  type: "update",
                  action: () =>
                    updateReport({
                      seriesId: (data as SingleReport | ReportSeries).seriesId,
                      name: data.name,
                      description: (data as SingleReport | ReportSeries)
                        .description,
                      type: data.type,
                    }),
                },
                {
                  type: "share",
                  action: async () =>
                    await share(
                      getSharedURL(
                        (data as SingleReport | ReportSeriesItem).reportId,
                      ),
                    ),
                },
              ],
              data.type,
              {
                deleteReportWithConfirmation: deleteReportWithConfirmation,
                deleteReportSeriesWithConfirmation:
                  deleteReportSeriesWithConfirmation,
                seriesId: (data as SingleReport | ReportSeries).seriesId,
                reportId: (data as SingleReport | ReportSeriesItem).reportId,
              },
              canWrite(),
              canDelete(props.row.original.userId),
            )}
          />
        ) : undefined;
      },
      meta: {
        width: "6rem",
        cellStyle: "button",
      },
    }),
  ];
}

export function StatisticReports({
  data,
  isFetchingReports,
}: {
  data: StatisticReportsType;
  isFetchingReports: boolean;
}) {
  const RIGHT_STACK_WIDTH = "440px";

  const copy = useCopy();

  const [openCreateReportSidebar, setOpenCreateReportSidebar] = useState(false);
  const [openUpdateReportSidebar, setOpenUpdateReportSidebar] =
    useState<UpdateReportSidebarReportInfo | null>(null);
  const [openAutomateReportSidebar, setOpenAutomateReportSidebar] =
    useState(false);
  const { openConfirmationDialog } = useConfirmationDialog();
  const { deleteReportSeriesWithConfirmation, deleteReportWithConfirmation } =
    useDeleteWithConfirmation();
  const deactivateReportSeries = useDeactivateReportSeries();
  const userPermissions = useStatisticRoleChecks();

  function updateReport(report: UpdateReportSidebarReportInfo) {
    setOpenUpdateReportSidebar({ ...report });
  }

  function getSubRows(item: ReportTableRow) {
    return item.type === ReportDataType.Series ? item.subRows : undefined;
  }

  function deactivateReportSeriesWithConfirmation(seriesId: string) {
    openConfirmationDialog({
      color: "danger",
      title: "Automatisierung deaktivieren?",
      description:
        "Die Automatisierung wird sofort deaktiviert und der nächste geplante Report wird nicht erstellt.",
      confirmLabel: "Deaktivieren",
      onConfirm: () => deactivateReportSeries(seriesId),
    });
  }

  return (
    <>
      {openCreateReportSidebar && (
        <OverlayBoundary>
          <AddReportSidebar
            statisticId={data.statisticId}
            onClose={() => setOpenCreateReportSidebar(false)}
          />
        </OverlayBoundary>
      )}
      {openUpdateReportSidebar && (
        <OverlayBoundary>
          <UpdateReportSidebar
            onClose={() => setOpenUpdateReportSidebar(null)}
            report={openUpdateReportSidebar}
          />
        </OverlayBoundary>
      )}
      {openAutomateReportSidebar && (
        <OverlayBoundary>
          <AutomateReportSidebar
            onClose={() => setOpenAutomateReportSidebar(false)}
            statisticId={data.statisticId}
          />
        </OverlayBoundary>
      )}
      <Stack gap={3} flex={1} sx={{ overflowY: "auto" }}>
        {userPermissions.canWrite() && (
          <Stack alignSelf="flex-end" direction="row" gap={3}>
            <RefreshButton
              key="refreshStatisticReports"
              loading={isFetchingReports}
              queryKey={getStatisticReportsQueryKey([data.statisticId])}
            />
            <Button
              startDecorator={<Add />}
              onClick={() => setOpenCreateReportSidebar(true)}
            >
              Einzel-Report erstellen
            </Button>
          </Stack>
        )}
        <Stack
          flex={1}
          flexWrap={{ lg: "nowrap", xxs: "wrap" }}
          flexDirection="row"
          gap={3}
          sx={{ overflowY: "auto" }}
        >
          <TablePage
            data-testid="statistic-reports-table"
            sx={{
              width: `calc(100% - ${RIGHT_STACK_WIDTH})`,
            }}
            fullHeight
          >
            <TableSheet>
              <DataTable
                striped={false}
                wrapContent
                wrapHeader
                columns={columns(
                  deleteReportWithConfirmation,
                  deleteReportSeriesWithConfirmation,
                  updateReport,
                  copy,
                  userPermissions.canDelete,
                  userPermissions.canWrite,
                )}
                data={data.reports}
                noDataComponent={() => (
                  <Box flex={1} alignContent="center">
                    <NoSearchResults info="Keine Reports vorhanden" />
                  </Box>
                )}
                rowNavRoute={(row) =>
                  row.original.type !== "SERIES" &&
                  row.original.status === ApiStatisticState.Completed
                    ? routes.reports.details(row.original.reportId).index
                    : undefined
                }
                enableSortingRemoval={false}
                sorting={{
                  manualSorting: false,
                  initialSorting: [
                    {
                      id: "timeRangeStart",
                      desc: true,
                    },
                  ],
                }}
                getSubRows={getSubRows}
              />
            </TableSheet>
          </TablePage>
          <Stack sx={{ width: { lg: RIGHT_STACK_WIDTH, xxs: "100%" } }}>
            <ReportAutomationTile
              activeSeriesInfo={data.activeSeries}
              onClickAutomate={() => setOpenAutomateReportSidebar(true)}
              onClickDeactivate={deactivateReportSeriesWithConfirmation}
              updateReportSeries={updateReport}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
