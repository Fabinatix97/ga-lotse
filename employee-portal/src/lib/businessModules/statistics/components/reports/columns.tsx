/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createColumnHelper } from "@tanstack/react-table";

import { translateReportType } from "@/lib/businessModules/statistics/api/mapper/translateReportType";
import { translateDataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import {
  ReportOverviewTableRow,
  ReportSeriesItemOverview,
  ReportSeriesOverview,
  SingleReportOverview,
} from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";
import { getSharedURL } from "@/lib/businessModules/statistics/components/shared/getSharedURL";
import { ActionsMenu } from "@/lib/shared/components/buttons/ActionsMenu";

import {
  DeleteReportOrSeries,
  getReportActionItems,
} from "./getReportActionItems";

const columnHelper = createColumnHelper<ReportOverviewTableRow>();

const meta = {
  canNavigate: {
    parentRow: true,
    subRow: true,
  },
  width: "10rem",
};

export function getReportsOverviewColumns(
  share: (id: string) => Promise<void>,
  deleteReportWithConfirmation: (reportId: string) => void,
  deleteReportSeriesWithConfirmation: (seriesId: string) => void,
  exportData: (
    item: SingleReportOverview | ReportSeriesItemOverview,
  ) => Promise<void>,
  canWrite: boolean,
  canDelete: (creatorUserId: string) => boolean,
) {
  return [
    columnHelper.accessor("name", {
      header: "Name",
      enableSorting: false,
      meta,
    }),
    columnHelper.accessor("dataSourceName", {
      header: "Datenquelle",
      meta,
      enableSorting: false,
    }),
    columnHelper.accessor("dataSensitivity", {
      header: "Sensibilität",
      cell: (props) => translateDataSourceSensitivity(props.getValue()),
      meta,
      enableSorting: false,
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
            [
              {
                type: "share",
                action: async () =>
                  await share(
                    getSharedURL({
                      detailLinkId: (
                        props.row.original as
                          | SingleReportOverview
                          | ReportSeriesItemOverview
                      ).reportId,
                      statisticsSubRoute: "reports",
                    }),
                  ),
              },
              {
                type: "export",
                action: () =>
                  exportData(
                    props.row.original as
                      | SingleReportOverview
                      | ReportSeriesItemOverview,
                  ),
              },
            ],
            props.row.original.type,
            {
              deleteReportWithConfirmation: deleteReportWithConfirmation,
              deleteReportSeriesWithConfirmation:
                deleteReportSeriesWithConfirmation,
              seriesId: (props.row.original as ReportSeriesOverview).seriesId,
              reportId: (
                props.row.original as
                  | SingleReportOverview
                  | ReportSeriesItemOverview
              ).reportId,
            } satisfies DeleteReportOrSeries,
            canWrite,
            canDelete(props.row.original.userId),
            false,
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
