/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEvaluationResponse } from "@eshg/employee-portal-api/statistics";

import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import {
  FlatAttribute,
  mapTableColumnHeadersToFlatAttributes,
} from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  StatisticDetailsTableRow,
  mapTableData,
} from "@/lib/businessModules/statistics/api/models/statisticDetailsTableData";

export interface StatisticDetailsTableView {
  statisticName: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
  attributes: FlatAttribute[];
  tableData: StatisticDetailsTableRow[];
  totalNumberOfElements: number;
}

export function mapStatisticToTableView(
  statistic: ApiGetEvaluationResponse,
): StatisticDetailsTableView {
  const attributes = mapTableColumnHeadersToFlatAttributes(
    statistic.tableColumnHeaders,
  );

  return {
    statisticName: statistic.evaluationInfo.name,
    timeRangeStart: statistic.evaluationInfo.timeRangeStart,
    timeRangeEnd: mapTimeRangeEndApiToFrontend(
      statistic.evaluationInfo.timeRangeEnd,
    ),
    attributes,
    tableData: mapTableData(statistic.dataRows, attributes),
    totalNumberOfElements: statistic.totalNumberOfElements,
  };
}
