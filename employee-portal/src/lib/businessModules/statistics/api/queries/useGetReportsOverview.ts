/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReportsRequest,
  ApiGetReportsResponse,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";
import { ReportsOverview } from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/statisticReports";

import { reportApiQueryKey } from "./apiQueryKeys";

export function mapToReportsOverview(
  response: ApiGetReportsResponse,
): ReportsOverview {
  const reports = response.reportSeriesList.map((reportSeries) => {
    switch (reportSeries.reportType) {
      case "MANUAL":
        if (reportSeries.reportInfos.length === 1) {
          const singleReport = reportSeries.reportInfos[0]!;
          return {
            reportId: singleReport.id,
            seriesId: reportSeries.id,
            name: reportSeries.name,
            timeRangeStart: singleReport.timeRangeStart,
            timeRangeEnd: singleReport.timeRangeEnd,
            type: ReportDataType.Single,
            userId: reportSeries.userId,
          };
        }
        throw Error("reportInfos length doesn't match");
      case "AUTO":
        throw Error("not implemented yet");
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
