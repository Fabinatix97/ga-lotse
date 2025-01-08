/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReportDetailPageResponse,
  ApiReportType,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useReportApi } from "@/lib/businessModules/statistics/api/clients";
import {
  FlatAttribute,
  mapTableColumnHeadersToFlatAttributes,
} from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { ReportDetailsView } from "@/lib/businessModules/statistics/api/models/reportDetailsViewTypes";
import { fullName } from "@/lib/shared/components/users/userFormatter";

import { reportApiQueryKey } from "./apiQueryKeys";
import { mapAnalyses } from "./useGetDetailPageInformation";

export function mapToReportDetailsView(
  response: ApiGetReportDetailPageResponse,
): ReportDetailsView {
  const user = response.userReportSeries;
  const attributes: FlatAttribute[] = mapTableColumnHeadersToFlatAttributes(
    response.tableColumnHeaders,
  );
  const isReportOfSeries = response.reportType === ApiReportType.Auto;
  return {
    id: response.id,
    seriesId: response.reportSeriesId,
    title: isReportOfSeries
      ? `${response.reportSeriesName} - Ausgabe #${response.name}`
      : response.reportSeriesName,
    description: response.description,
    start: response.timeRangeStart,
    end: response.timeRangeEnd,
    createdAt: response.executionDate,
    createdBy: fullName(user),
    dataSource: {
      name: response.tableColumnHeaders[0]!.dataSourceName,
      attributeLabels: attributes.map((it) => it.name),
      datasetAmount: response.totalNumberOfElements,
    },
    analyses: mapAnalyses(response.analyses, attributes),
    attributes: attributes,
    userId: user?.userId,
    numberInSeries: isReportOfSeries ? response.name : undefined,
    tooMuchDataForExport: response.tooMuchDataForExport,
  };
}

export function useGetReportDetails(reportId: string) {
  const reportApi = useReportApi();
  const queryResult = useSuspenseQuery({
    queryKey: reportApiQueryKey(["getReportDetailPage", reportId]),
    queryFn: () => reportApi.getReportDetailPage(reportId),
    select: mapToReportDetailsView,
  });
  return queryResult.data;
}
