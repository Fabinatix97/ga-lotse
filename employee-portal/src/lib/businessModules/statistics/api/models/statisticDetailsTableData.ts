/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDataRow } from "@eshg/employee-portal-api/statistics";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export type StatisticDetailsTableValue = unknown;

export type StatisticDetailsTableRow = Record<
  string,
  StatisticDetailsTableValue
>;

export type StatisticDetailsTableData = StatisticDetailsTableRow[];

export function mapTableData(
  dataRows: ApiDataRow[],
  flatAttributes: FlatAttribute[],
): StatisticDetailsTableData {
  return dataRows.map((row) =>
    Object.fromEntries(
      flatAttributes.map((attribute, index) => [
        attribute.key,
        row.values[index],
      ]),
    ),
  );
}
