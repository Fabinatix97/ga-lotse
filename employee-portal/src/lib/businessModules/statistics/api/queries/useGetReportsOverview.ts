/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReportsRequest,
  ApiGetReportsResponse,
  ApiReportInfo,
  ApiReportSeries,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import {
  ReportSeriesItemOverview,
  ReportSeriesOverview,
  ReportsOverview,
  SingleReportOverview,
} from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";

import { reportApiQueryKey } from "./apiQueryKeys";

export function mapSingleReports(
  singleReport: ApiReportInfo,
  reportSeries: ApiReportSeries,
  isChild = false,
): SingleReportOverview | ReportSeriesItemOverview {
  return {
    userId: reportSeries.userId,
    reportId: singleReport.id,
    seriesId: reportSeries.id,
    name: isChild ? `# ${singleReport.name}` : singleReport.name,
    timeRangeStart: singleReport.timeRangeStart,
    timeRangeEnd: singleReport.timeRangeEnd,
    type: isChild ? ReportDataType.Child : ReportDataType.Single,
    dataSourceName: reportSeries.dataSourceNames[0]!,
    tooMuchDataForExport: singleReport.tooMuchDataForExport,
  };
}

export function mapToReportsOverview(
  response: ApiGetReportsResponse,
): ReportsOverview {
  const reports = response.reportSeriesList.map((reportSeries) => {
    switch (reportSeries.reportType) {
      case "MANUAL":
        if (reportSeries.reportInfos.length === 1) {
          const singleReport = reportSeries.reportInfos[0]!;
          return mapSingleReports(
            singleReport,
            reportSeries,
          ) as SingleReportOverview;
        }
        throw Error("reportInfos length doesn't match");
      case "AUTO":
        return {
          subRows: reportSeries.reportInfos.map(
            (reportInfo) =>
              mapSingleReports(
                reportInfo,
                reportSeries,
                true,
              ) as ReportSeriesItemOverview,
          ),
          name: reportSeries.name,
          seriesId: reportSeries.id,
          timeRangeStart: reportSeries.timeRangeStart,
          timeRangeEnd: reportSeries.timeRangeEnd,
          type: ReportDataType.Series,
          userId: reportSeries.userId,
          dataSourceName: reportSeries.dataSourceNames[0]!,
        } satisfies ReportSeriesOverview;
    }
  });
  return {
    totalNumberOfElements: response.totalNumberOfElements,
    reports,
  };
}

export function useGetReportsOverview(reportsRequest: ApiGetReportsRequest) {
  const reportSeriesApi = useReportSeriesApi();
  const queryResult = useSuspenseQuery({
    queryKey: reportApiQueryKey(["getReportOverview", reportsRequest]),
    queryFn: () => reportSeriesApi.getReportOverview(reportsRequest),
    select: mapToReportsOverview,
  });
  return queryResult.data;
}
