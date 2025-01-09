/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReportsResponse,
  ApiReportInfo,
  ApiReportSeries,
  ApiReportType,
  ReportSeriesApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQueries } from "@tanstack/react-query";

import {
  useDataSourceApi,
  useReportSeriesApi,
} from "@/lib/businessModules/statistics/api/clients";
import { extractFilterValue } from "@/lib/businessModules/statistics/api/mapper/extractFilterValue";
import { mapDateSpanFilterToApiDateSpan } from "@/lib/businessModules/statistics/api/mapper/mapDateSpanFilterToApiDateSpan";
import {
  DataSourceSensitivity,
  mapReportDataSourceSensitivityFrontendToApi,
} from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";
import { ReportDataType } from "@/lib/businessModules/statistics/api/models/evaluationReports";
import {
  PageRequest,
  mapPageRequest,
} from "@/lib/businessModules/statistics/api/models/pageRequest";
import {
  ReportSeriesItemOverview,
  ReportSeriesOverview,
  ReportsOverview,
  SingleReportOverview,
} from "@/lib/businessModules/statistics/api/models/reportsOverviewTypes";
import { createQueryGetAvailableDataSources } from "@/lib/businessModules/statistics/api/queries/useGetAvailableDataSources";
import { ReportOverviewFilterKey } from "@/lib/businessModules/statistics/components/reports/filterDefinitions";
import { DateSpanFilterValue } from "@/lib/shared/components/filterSettings/models/DateSpanFilter";
import { EnumFilterValue } from "@/lib/shared/components/filterSettings/models/EnumFilter";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

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
    dataSensitivity: mapReportDataSourceSensitivityFrontendToApi(
      singleReport.dataSensitivity,
    ),
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
          dataSensitivity: mapReportDataSourceSensitivityFrontendToApi(
            reportSeries.reportInfos[0]!.dataSensitivity,
          ),
        } satisfies ReportSeriesOverview;
    }
  });
  return {
    totalNumberOfElements: response.totalNumberOfElements,
    reports,
  };
}

export function mapPageRequestWithFilterToApi(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  const reportType = extractFilterValue<EnumFilterValue>(
    filterValues,
    ReportOverviewFilterKey.ReportType,
  )?.selectedValues[0] as ApiReportType;
  const dataSourceIds = extractFilterValue<EnumFilterValue>(
    filterValues,
    ReportOverviewFilterKey.DataSource,
  )?.selectedValues;
  const startDateSpan = mapDateSpanFilterToApiDateSpan(
    extractFilterValue<DateSpanFilterValue>(
      filterValues,
      ReportOverviewFilterKey.DateRangeStart,
    ),
    false,
  );
  const endDateSpan = mapDateSpanFilterToApiDateSpan(
    extractFilterValue<DateSpanFilterValue>(
      filterValues,
      ReportOverviewFilterKey.DateRangeEnd,
    ),
    true,
  );
  const sensitivities = extractFilterValue<EnumFilterValue>(
    filterValues,
    ReportOverviewFilterKey.Sensitivity,
  )?.selectedValues?.map((it) =>
    mapReportDataSourceSensitivityFrontendToApi(it as DataSourceSensitivity),
  );

  return {
    ...mapPageRequest(pageRequest, () => undefined),
    filterOptions: {
      reportType: reportType,
      dataSourceIds: dataSourceIds,
      dataSensitivities: sensitivities,
      start: startDateSpan,
      end: endDateSpan,
    },
  };
}

export function createQueryGetReportsOverview(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
  reportSeriesApi: ReportSeriesApi,
) {
  return {
    queryKey: reportApiQueryKey([
      "getReportOverview",
      pageRequest,
      filterValues,
    ]),
    queryFn: () =>
      reportSeriesApi.getReportOverview(
        mapPageRequestWithFilterToApi(pageRequest, filterValues),
      ),
    select: mapToReportsOverview,
  };
}

export function useGetReportsOverview(
  pageRequest: PageRequest,
  filterValues: FilterValue[],
) {
  const reportSeriesApi = useReportSeriesApi();
  const dataSourceApi = useDataSourceApi();

  const [{ data: dataSources }, { data: reportsOverview }] = useSuspenseQueries(
    {
      queries: [
        createQueryGetAvailableDataSources(dataSourceApi),
        createQueryGetReportsOverview(
          pageRequest,
          filterValues,
          reportSeriesApi,
        ),
      ],
    },
  );

  return {
    dataSources,
    reportsOverview,
  };
}
