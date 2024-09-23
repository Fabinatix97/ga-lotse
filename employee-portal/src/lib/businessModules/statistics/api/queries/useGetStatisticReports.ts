/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReportSeriesEntriesOfStatisticResponse,
  ApiReportSeries,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import {
  ReportDataType,
  SingleReport,
  StatisticReports,
} from "@/lib/businessModules/statistics/api/models/statisticReports";

import { getStatisticReportsQueryKey } from "./apiQueryKeys";

function mapReport(apiReportSeries: ApiReportSeries): SingleReport {
  //TODO need report series handling, once this exists
  const apiReportInfo = apiReportSeries.reportInfos[0]!;
  return {
    reportId: apiReportInfo.id,
    seriesId: apiReportSeries.id,
    name: apiReportInfo.name,
    timeRangeStart: apiReportInfo.timeRangeStart,
    timeRangeEnd: apiReportInfo.timeRangeEnd,
    datasetAmount: apiReportInfo.totalNumberOfElements,
    type: ReportDataType.Single,
    status: apiReportInfo.state,
    description: apiReportSeries.description,
  };
}

export function mapToStatisticReports(
  response: ApiGetReportSeriesEntriesOfStatisticResponse,
): StatisticReports {
  return {
    statisticId: response.statisticId,
    title: response.statisticName,
    reports: response.reportSeriesEntries.map(mapReport),
  };
}

export function useGetStatisticReports(statisticId: string) {
  const statisticApi = useStatisticApi();
  const { data, isFetching } = useSuspenseQuery({
    queryKey: getStatisticReportsQueryKey([statisticId]),
    queryFn: () => statisticApi.getReportSeriesEntriesOfStatistic(statisticId),
    select: mapToStatisticReports,
  });
  return { data, isFetching };
}
