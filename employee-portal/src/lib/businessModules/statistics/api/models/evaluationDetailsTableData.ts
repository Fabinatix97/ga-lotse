/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiDataRow } from "@eshg/employee-portal-api/statistics";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export type EvaluationDetailsTableValue = unknown;

export type EvaluationDetailsTableRow = Record<
  string,
  EvaluationDetailsTableValue
>;

export type EvaluationDetailsTableData = EvaluationDetailsTableRow[];

export function mapTableData(
  dataRows: ApiDataRow[],
  flatAttributes: FlatAttribute[],
): EvaluationDetailsTableData {
  return dataRows.map((row) =>
    Object.fromEntries(
      flatAttributes.map((attribute, index) => [
        attribute.key,
        row.values[index],
      ]),
    ),
  );
}
