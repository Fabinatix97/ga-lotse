/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetStatisticResponse } from "@eshg/employee-portal-api/statistics";

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
  statistic: ApiGetStatisticResponse,
): StatisticDetailsTableView {
  const attributes = mapTableColumnHeadersToFlatAttributes(
    statistic.tableColumnHeaders,
  );

  return {
    statisticName: statistic.statisticInfo.name,
    timeRangeStart: statistic.statisticInfo.timeRangeStart,
    timeRangeEnd: mapTimeRangeEndApiToFrontend(
      statistic.statisticInfo.timeRangeEnd,
    ),
    attributes,
    tableData: mapTableData(statistic.dataRows, attributes),
    totalNumberOfElements: statistic.totalNumberOfElements,
  };
}
