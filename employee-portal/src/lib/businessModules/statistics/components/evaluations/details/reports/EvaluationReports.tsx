/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiReportState } from "@eshg/employee-portal-api/statistics";
import { HiddenContainer } from "@eshg/lib-portal/components/HiddenContainer";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, NotInterestedOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { useExportReportData } from "@/lib/businessModules/statistics/api/downloads/useExportReportData";
import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import {
  EvaluationReports as EvaluationReportsType,
  ReportDataType,
  ReportSeries,
  ReportSeriesItem,
  ReportTableRow,
  SingleReport,
} from "@/lib/businessModules/statistics/api/models/evaluationReports";
import { ReportSeriesState } from "@/lib/businessModules/statistics/api/models/reportSeriesTypes";
import { useDeactivateReportSeries } from "@/lib/businessModules/statistics/api/mutations/useDeactivateReportSeries";
import { getEvaluationReportsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { AddReportSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/reports/AddReportSidebar/AddReportSidebar";
import { ReportStateChip } from "@/lib/businessModules/statistics/components/evaluations/details/reports/ReportStateChip";
import {
  UpdateReportSidebar,
  UpdateReportSidebarReportInfo,
} from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/components/evaluations/useStatisticsRoleChecks";
import {
  getReportActionItems,
  getSharedURL,
} from "@/lib/businessModules/statistics/components/reports/getReportActionItems";
import { useDeleteWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteWithConfirmation";
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
  exportData: (item: SingleReport | ReportSeriesItem) => Promise<void>,
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
        return (
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
                {
                  type: "export",
                  action: () =>
                    exportData(data as SingleReport | ReportSeriesItem),
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
              props.row.original.type === ReportDataType.Series
                ? props.row.original.isAllItemsDeleting
                : props.row.original.status !== ApiReportState.Completed,
            )}
          />
        );
      },
      meta: {
        width: "6rem",
        cellStyle: "button",
      },
    }),
  ];
}

export function EvaluationReports({
  data,
  isFetchingReports,
}: {
  data: EvaluationReportsType;
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
  const { download: exportData, downloadContainerRef } = useExportReportData();
  const deactivateReportSeries = useDeactivateReportSeries();
  const userPermissions = useStatisticsRoleChecks();

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

  return data.anonymized ? (
    <>
      <HiddenContainer ref={downloadContainerRef} />

      {openCreateReportSidebar && (
        <OverlayBoundary>
          <AddReportSidebar
            evaluationId={data.evaluationId}
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
            evaluationId={data.evaluationId}
          />
        </OverlayBoundary>
      )}
      <Stack gap={3} flex={1} sx={{ overflowY: "auto" }}>
        {userPermissions.canWrite() && (
          <Stack alignSelf="flex-end" direction="row" gap={3}>
            <RefreshButton
              loading={isFetchingReports}
              queryKey={getEvaluationReportsQueryKey([data.evaluationId])}
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
                  (item) =>
                    exportData(
                      { reportId: item.reportId },
                      { tooMuchDataForExport: item.tooMuchDataForExport },
                    ),
                  userPermissions.canDelete,
                  userPermissions.canWrite,
                )}
                data={data.reports}
                noDataComponent={() => (
                  <Box flex={1} alignContent="center">
                    <NoSearchResults info="Keine Reports vorhanden" />
                  </Box>
                )}
                rowNavigation={{
                  route: (row) =>
                    row.original.type !== ReportDataType.Series &&
                    row.original.status === ApiReportState.Completed
                      ? routes.reports.details(row.original.reportId).index
                      : undefined,
                  focusColumnAccessorKey: "name",
                }}
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
              canWrite={userPermissions.canWrite}
            />
          </Stack>
        </Stack>
      </Stack>
    </>
  ) : (
    <Card
      variant="plain"
      sx={{
        alignSelf: "center",
        borderRadius: "lg",
        padding: 3,
        gap: 3,
        alignItems: "center",
      }}
    >
      <CardContent sx={{ alignItems: "center", gap: 2 }}>
        <NotInterestedOutlined sx={{ width: 130, height: 130 }} />
        <Typography level="h1">Reports nicht verfügbar</Typography>
        <Typography level="body-md">
          Reports für Auswertungen mit nicht anonymisierten Daten stehen nicht
          zur Verfügung.
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: 0 }}>
        <InternalLinkButton
          href={routes.evaluations.details(data.evaluationId).index}
        >
          Zu den Analysen
        </InternalLinkButton>
      </CardActions>
    </Card>
  );
}
