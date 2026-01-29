/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add, Info, NotInterestedOutlined } from "@mui/icons-material";
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
import { isPlainObject } from "remeda";

import {
  ActionsMenu,
  DataTable,
  NoSearchResults,
  TablePage,
  TableSheet,
  useConfirmationDialog,
} from "@eshg/lib-employee-portal";
import { InternalLinkButton, formatDate } from "@eshg/lib-portal";
import { ApiReportState } from "@eshg/statistics-api";

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
import { useAnonymizationFailedSidebar } from "@/lib/businessModules/statistics/components/evaluations/AnonymizationFailedSidebar";
import { useAddReportSidebar } from "@/lib/businessModules/statistics/components/evaluations/details/reports/AddReportSidebar/AddReportSidebar";
import { ReportStateChip } from "@/lib/businessModules/statistics/components/evaluations/details/reports/ReportStateChip";
import {
  UpdateReportSidebarReportInfo,
  useUpdateReportSidebar,
} from "@/lib/businessModules/statistics/components/evaluations/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { getReportActionItems } from "@/lib/businessModules/statistics/components/reports/getReportActionItems";
import { useDeleteWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteWithConfirmation";
import { getSharedURL } from "@/lib/businessModules/statistics/components/shared/getSharedURL";
import { useDataExportGuard } from "@/lib/businessModules/statistics/components/shared/hooks/useDataExportGuard";
import { useStatisticsRoleChecks } from "@/lib/businessModules/statistics/permissions/useStatisticsRoleChecks";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { useCopy } from "@/lib/shared/hooks/useCopy";

import { useAutomateReportSidebar } from "./AutomateReportSidebar/AutomateReportSidebar";
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
  showFailedAnonymizationInformation: (reportId: string) => void,
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
        width: "12rem",
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      enableSorting: false,
      cell: (props) => {
        const data = props.row.original;
        const anonymizationFailed =
          data.status === ApiReportState.AnonymizationFailed;
        return (
          <ActionsMenu
            actionItems={[
              anonymizationFailed && {
                label: "Informationen",
                startDecorator: <Info />,
                onClick: () =>
                  showFailedAnonymizationInformation(data.reportId),
              },
              ...getReportActionItems(
                anonymizationFailed
                  ? []
                  : [
                      {
                        type: "update",
                        action: () =>
                          updateReport({
                            seriesId: (data as SingleReport | ReportSeries)
                              .seriesId,
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
                            getSharedURL({
                              detailLinkId: (
                                data as SingleReport | ReportSeriesItem
                              ).reportId,
                              statisticsSubRoute: "reports",
                            }),
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
                  : props.row.original.status !== ApiReportState.Completed &&
                      props.row.original.status !==
                        ApiReportState.AnonymizationFailed,
              ),
            ].filter(isPlainObject)}
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

  const addReportSidebar = useAddReportSidebar();
  const updateReportSidebar = useUpdateReportSidebar();
  const automateReportSidebar = useAutomateReportSidebar();
  const anonymizationFailedSidebar = useAnonymizationFailedSidebar();
  const { openConfirmationDialog } = useConfirmationDialog();
  const { deleteReportSeriesWithConfirmation, deleteReportWithConfirmation } =
    useDeleteWithConfirmation();
  const { download: exportData } = useExportReportData();
  const dataExportGuard = useDataExportGuard();
  const deactivateReportSeries = useDeactivateReportSeries();
  const userPermissions = useStatisticsRoleChecks();

  function openAddReportSidebar() {
    addReportSidebar.open({ evaluationId: data.evaluationId });
  }

  function openUpdateReportSidebar(report: UpdateReportSidebarReportInfo) {
    updateReportSidebar.open({ report });
  }

  function openAutomateReportSidebar() {
    automateReportSidebar.open({ evaluationId: data.evaluationId });
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

  return data.sensitive ? (
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
          Reports für Auswertungen mit sensiblen Daten stehen nicht zur
          Verfügung.
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
  ) : (
    <Stack gap={3} flex={1} sx={{ overflowY: "auto" }}>
      {userPermissions.canWrite() && (
        <Stack alignSelf="flex-end" direction="row" gap={3}>
          <RefreshButton
            autoFocus
            loading={isFetchingReports}
            queryKey={getEvaluationReportsQueryKey([data.evaluationId])}
          />
          <Button startDecorator={<Add />} onClick={openAddReportSidebar}>
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
                (reportId) =>
                  anonymizationFailedSidebar.open({
                    id: reportId,
                    isReport: true,
                  }),
                deleteReportWithConfirmation,
                deleteReportSeriesWithConfirmation,
                openUpdateReportSidebar,
                copy,
                async (item) =>
                  dataExportGuard(item.dataSensitivity, () =>
                    exportData(
                      { reportId: item.reportId },
                      { tooMuchDataForExport: item.tooMuchDataForExport },
                    ),
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
            updateReportSeries={openUpdateReportSidebar}
            canWrite={userPermissions.canWrite}
            onClickAutomate={openAutomateReportSidebar}
            onClickDeactivate={deactivateReportSeriesWithConfirmation}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
