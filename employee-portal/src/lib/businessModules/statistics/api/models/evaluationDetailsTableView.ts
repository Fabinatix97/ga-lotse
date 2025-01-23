/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEvaluationResponse } from "@eshg/employee-portal-api/statistics";

import { mapTimeRangeEndApiToFrontend } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";
import {
  EvaluationDetailsTableRow,
  mapTableData,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import {
  ProcedureReferences,
  mapProcedureReferences,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableProcedureReferences";
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
  procedureReferences: ProcedureReferences | undefined;
  totalNumberOfElements: number;
}

export function mapEvaluationToTableView(
  evaluation: ApiGetEvaluationResponse,
): EvaluationDetailsTableView {
  const attributes = mapTableColumnHeadersToFlatAttributes(
    evaluation.tableColumnHeaders,
  );
  const tableData = mapTableData(evaluation.dataRows, attributes);

  return {
    evaluationName: evaluation.evaluationInfo.name,
    timeRangeStart: evaluation.evaluationInfo.timeRangeStart,
    timeRangeEnd: mapTimeRangeEndApiToFrontend(
      evaluation.evaluationInfo.timeRangeEnd,
    ),
    attributes,
    tableData,
    procedureReferences: mapProcedureReferences({ tableData, attributes }),
    totalNumberOfElements: evaluation.totalNumberOfElements,
  };
}
