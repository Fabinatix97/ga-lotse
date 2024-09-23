/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Delete, Share } from "@mui/icons-material";
import { ColorPaletteProp } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import { ReportForOverview } from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/statisticReports";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

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
  shareFunction: (id: string) => Promise<void>,
  deleteReport: (id: string) => void,
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
          actionItems={[
            {
              label: "Teilen",
              startDecorator: <Share />,
              onClick: () => shareFunction(getId(props.row.original)),
            },
            ...(props.row.original.type === ReportDataType.Single
              ? [
                  {
                    label:
                      props.row.original.type === "SINGLE"
                        ? "Report löschen"
                        : "Ausgabe löschen",
                    startDecorator: <Delete />,
                    onClick: () => deleteReport(props.row.original.seriesId),
                    color: "danger" as ColorPaletteProp,
                  },
                ]
              : []),
          ]}
        />
      ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}
