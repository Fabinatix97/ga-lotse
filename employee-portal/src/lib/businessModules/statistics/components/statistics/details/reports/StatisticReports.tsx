/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiReportState,
  ApiStatisticState,
} from "@eshg/employee-portal-api/statistics";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import {
  SingleReport,
  StatisticReports as StatisticReportsType,
} from "@/lib/businessModules/statistics/api/models/statisticReports";
import { getStatisticReportsQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { useDeleteReportWithConfirmation } from "@/lib/businessModules/statistics/components/reports/useDeleteReportWithConfirmation";
import { ReportStateChip } from "@/lib/businessModules/statistics/components/statistics/ReportStateChip";
import { AddReportSidebar } from "@/lib/businessModules/statistics/components/statistics/details/reports/AddReportSidebar/AddReportSidebar";
import {
  UpdateReportSidebar,
  UpdateReportSidebarReportInfo,
} from "@/lib/businessModules/statistics/components/statistics/details/reports/UpdateReportSidebar/UpdateReportSidebar";
import { routes } from "@/lib/businessModules/statistics/shared/routes";
import { NoSearchResults } from "@/lib/shared/components/NoSearchResult";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";
import { RefreshButton } from "@/lib/shared/components/buttons/RefreshButton";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { LabelValuePair } from "@/lib/shared/components/infoTile/LabelValuePair";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";

const columnHelper = createColumnHelper<SingleReport>();

const meta = {
  canNavigate: {
    parentRow: true,
  },
  width: "10rem",
};

function columns(
  deleteReportWithConfirmation: (reportId: string, name: string) => void,
  editReport: (report: SingleReport) => void,
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
      cell: (props) => props.getValue(),
      meta,
    }),
    columnHelper.accessor("type", {
      header: "Report-Typ",
      cell: (props) => translateReportType[props.getValue()],
      meta,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (props) => <ReportStateChip value={props.getValue()} />,
      meta: {
        canNavigate: {
          parentRow: true,
        },
        width: "8rem",
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "actions",
      enableSorting: false,
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Report bearbeiten",
              onClick: () => editReport(props.row.original),
              startDecorator: <Edit />,
              disabled: props.row.original.status !== ApiReportState.Completed,
            },
            {
              label: "Löschen",
              onClick: () =>
                deleteReportWithConfirmation(
                  props.row.original.seriesId,
                  props.row.original.name,
                ),
              startDecorator: <Delete />,
              color: "danger",
            },
          ]}
        />
      ),
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

  const [openCreateReportSidebar, setOpenCreateReportSidebar] = useState(false);
  const [openUpdateReportSidebar, setOpenUpdateReportSidebar] =
    useState<UpdateReportSidebarReportInfo | null>(null);
  const deleteReportWithConfirmation = useDeleteReportWithConfirmation();

  function updateReport(report: UpdateReportSidebarReportInfo) {
    setOpenUpdateReportSidebar({ ...report });
  }

  return (
    <>
      {openCreateReportSidebar && (
        <AddReportSidebar
          statisticId={data.statisticId}
          onClose={() => setOpenCreateReportSidebar(false)}
        />
      )}
      {openUpdateReportSidebar && (
        <UpdateReportSidebar
          onClose={() => setOpenUpdateReportSidebar(null)}
          report={openUpdateReportSidebar}
        />
      )}
      <Stack gap={3} flex={1} sx={{ overflowY: "auto" }}>
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
                wrapContent
                wrapHeader
                columns={columns(deleteReportWithConfirmation, updateReport)}
                data={data.reports}
                noDataComponent={() => (
                  <Box flex={1} alignContent="center">
                    <NoSearchResults info="Keine Reports vorhanden" />
                  </Box>
                )}
                rowNavRoute={(row) =>
                  row.original.status === ApiStatisticState.Completed
                    ? routes.reports.details(row.original.reportId).index
                    : undefined
                }
              />
            </TableSheet>
          </TablePage>
          <Stack sx={{ width: { lg: RIGHT_STACK_WIDTH, xxs: "100%" } }}>
            <Stack flex={0}>
              <InfoTile name="Automatisierung" title="Automatisierung">
                <LabelValuePair label={"Status"} value={"Deaktiviert"} />
                <Alert
                  title=""
                  message="Aktivieren Sie diese Option, um in regelmäßigen Abständen eine Report-Serie zu erstellen."
                  color="primary"
                />
              </InfoTile>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
