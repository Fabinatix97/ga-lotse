/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiFrequency,
  ApiGetReportSeriesEntriesOfEvaluationResponse,
  ApiReportSeries,
  ApiReportState,
  ApiReportingPeriod,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isNonNullish } from "remeda";

import {
  Interval,
  ReportSeriesState,
  ReportingPeriod,
} from "@/lib/businessModules/statistics/api//models/reportSeriesTypes";
import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import {
  ActiveSeriesInfo,
  EvaluationReports,
  ReportDataType,
  ReportSeries,
  ReportSeriesItem,
  SingleReport,
} from "@/lib/businessModules/statistics/api/models/evaluationReports";

import { getEvaluationReportsQueryKey } from "./apiQueryKeys";

function mapToInterval(apiFrequency?: ApiFrequency): Interval | undefined {
  switch (apiFrequency) {
    case ApiFrequency.Month:
      return Interval.Month;
    case ApiFrequency.ThreeMonths:
      return Interval.ThreeMonths;
    case ApiFrequency.HalfYear:
      return Interval.HalfYear;
    case ApiFrequency.Year:
      return Interval.Year;
    default:
      return undefined;
  }
}

function mapToReportingPeriod(
  apiReportingPeriod?: ApiReportingPeriod,
): ReportingPeriod | undefined {
  switch (apiReportingPeriod) {
    case ApiReportingPeriod.Month:
      return ReportingPeriod.Month;
    case ApiReportingPeriod.ThreeMonths:
      return ReportingPeriod.ThreeMonths;
    case ApiReportingPeriod.HalfYear:
      return ReportingPeriod.HalfYear;
    case ApiReportingPeriod.Year:
      return ReportingPeriod.Year;
    default:
      return undefined;
  }
}

function mapNextReport(series: ApiReportSeries): Date | undefined {
  return series.reportInfos.find(
    (report) => report.state === ApiReportState.Planned,
  )?.executionDate;
}

function mapSingleReport(apiReportSeries: ApiReportSeries): SingleReport {
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
    userId: apiReportSeries.userId,
    tooMuchDataForExport: apiReportInfo.tooMuchDataForExport,
  };
}

function mapSeriesReport(apiReportSeries: ApiReportSeries): ReportSeries {
  return {
    seriesId: apiReportSeries.id,
    userId: apiReportSeries.userId,
    name: apiReportSeries.name,
    type: ReportDataType.Series,
    description: apiReportSeries.description,
    timeRangeStart: apiReportSeries.timeRangeStart,
    timeRangeEnd: apiReportSeries.timeRangeEnd,
    status: apiReportSeries.active
      ? ReportSeriesState.Activated
      : ReportSeriesState.Deactivated,
    subRows: apiReportSeries.reportInfos.map(
      (reportInfo) =>
        ({
          type: ReportDataType.Child,
          userId: apiReportSeries.userId,
          reportId: reportInfo.id,
          name: `# ${reportInfo.name}`,
          timeRangeStart: reportInfo.timeRangeStart,
          timeRangeEnd: reportInfo.timeRangeEnd,
          datasetAmount: reportInfo.totalNumberOfElements,
          status: reportInfo.state,
          tooMuchDataForExport: reportInfo.tooMuchDataForExport,
        }) satisfies ReportSeriesItem,
    ),
    isAllItemsDeleting: apiReportSeries.reportInfos.every(
      (reportInfo) => reportInfo.state === ApiReportState.Deleting,
    ),
  };
}

function mapActiveSeries(
  response: ApiGetReportSeriesEntriesOfEvaluationResponse,
): ActiveSeriesInfo | undefined {
  const activeReportSeries = response.reportSeriesEntries.find(
    (reportSeriesEntry) => reportSeriesEntry.active,
  );
  return isNonNullish(activeReportSeries)
    ? {
        seriesId: activeReportSeries.id,
        name: activeReportSeries.name,
        description: activeReportSeries.description,
        interval: mapToInterval(activeReportSeries.frequency),
        reportingPeriod: mapToReportingPeriod(
          activeReportSeries.reportingPeriod,
        ),
        nextReport: mapNextReport(activeReportSeries),
      }
    : undefined;
}

export function mapToEvaluationReports(
  response: ApiGetReportSeriesEntriesOfEvaluationResponse,
): EvaluationReports {
  return {
    evaluationId: response.evaluationId,
    title: response.evaluationName,
    reports: response.reportSeriesEntries.map((reportSeriesEntry) => {
      return reportSeriesEntry.reportType === "AUTO"
        ? mapSeriesReport(reportSeriesEntry)
        : mapSingleReport(reportSeriesEntry);
    }),
    activeSeries: mapActiveSeries(response),
    anonymized: response.anonymized,
  };
}

export function useGetEvaluationReports(evaluationId: string) {
  const evaluationApi = useEvaluationApi();
  const { data, isFetching } = useSuspenseQuery({
    queryKey: getEvaluationReportsQueryKey([evaluationId]),
    queryFn: () =>
      evaluationApi.getReportSeriesEntriesOfEvaluation(evaluationId),
    select: mapToEvaluationReports,
  });
  return { data, isFetching };
}
