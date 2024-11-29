/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEvaluationResponse } from "@eshg/employee-portal-api/statistics";

import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import {
  EvaluationDetailsTableRow,
  mapTableData,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import {
  FlatAttribute,
  mapTableColumnHeadersToFlatAttributes,
} from "@/lib/businessModules/statistics/api/models/flatAttribute";

export interface EvaluationDetailsTableView {
  evaluationName: string;
  timeRangeStart: Date;
  timeRangeEnd: Date;
  attributes: FlatAttribute[];
  tableData: EvaluationDetailsTableRow[];
  totalNumberOfElements: number;
}

export function mapEvaluationToTableView(
  evaluation: ApiGetEvaluationResponse,
): EvaluationDetailsTableView {
  const attributes = mapTableColumnHeadersToFlatAttributes(
    evaluation.tableColumnHeaders,
  );

  return {
    evaluationName: evaluation.evaluationInfo.name,
    timeRangeStart: evaluation.evaluationInfo.timeRangeStart,
    timeRangeEnd: mapTimeRangeEndApiToFrontend(
      evaluation.evaluationInfo.timeRangeEnd,
    ),
    attributes,
    tableData: mapTableData(evaluation.dataRows, attributes),
    totalNumberOfElements: evaluation.totalNumberOfElements,
  };
}
