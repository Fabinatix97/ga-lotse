/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetReportDetailPageResponse,
  ApiReportType,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";
import { isNonNullish } from "remeda";

import { useReportApi } from "@/lib/businessModules/statistics/api/clients";
import {
  FlatAttribute,
  mapTableColumnHeadersToFlatAttributes,
} from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { ReportDetailsView } from "@/lib/businessModules/statistics/api/models/reportDetailsViewTypes";

import { reportApiQueryKey } from "./apiQueryKeys";
import { mapEvaluations } from "./useGetDetailPageInformation";

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
    createdBy: isNonNullish(user)
      ? `${user.firstName} ${user.lastName}`
      : undefined,
    dataSource: {
      name: response.tableColumnHeaders[0]!.dataSourceName,
      attributeLabels: attributes.map((it) => it.name),
      datasetAmount: response.totalNumberOfElements,
    },
    evaluations: mapEvaluations(response.analyses, attributes),
    attributes: attributes,
    userId: response.userReport?.userId ?? response.userReportSeries!.userId,
    numberInSeries: isReportOfSeries ? response.name : undefined,
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
