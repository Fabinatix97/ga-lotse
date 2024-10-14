/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createColumnHelper } from "@tanstack/react-table";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import { ReportForOverview } from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

import { getReportActionItems } from "./getReportActionItems";

const columnHelper = createColumnHelper<ReportForOverview>();

const meta = {
  canNavigate: {
    parentRow: true,
  },
  width: "10rem",
};

export function getId(reportData: ReportForOverview) {
  return reportData.type === "SINGLE"
    ? reportData.reportId
    : reportData.seriesId;
}

export function getReportsOverviewColumns(
  share: (id: string) => Promise<void>,
  deleteReportWithConfirmation: (id: string) => void,
  canWrite: boolean,
  canDelete: (creatorUserId: string) => boolean,
) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      enableSorting: false,
      meta,
    }),
    columnHelper.accessor("timeRangeStart", {
      header: "Start",
      cell: (props) => formatDate(props.getValue(), "DE"),
      meta,
      enableSorting: false,
    }),
    columnHelper.accessor("timeRangeEnd", {
      header: "Ende",
      cell: (props) => formatDate(props.getValue(), "DE"),
      enableSorting: false,
      meta,
    }),
    columnHelper.accessor("type", {
      header: "Report-Typ",
      cell: (props) => translateReportType[props.getValue()],
      enableSorting: false,
      meta,
    }),
    columnHelper.display({
      id: "actions",
      header: "Aktionen",
      cell: (props) => (
        <ActionsMenu
          actionItems={getReportActionItems(
            [],
            props.row.original.type === "SERIES",
            props.row.original.seriesId,
            getId(props.row.original),
            share,
            deleteReportWithConfirmation,
            canWrite,
            canDelete(props.row.original.userId),
          )}
        />
      ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
