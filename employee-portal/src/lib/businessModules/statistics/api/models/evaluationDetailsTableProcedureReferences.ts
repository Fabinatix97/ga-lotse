/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBusinessModule } from "@eshg/base-api";
import { isDefined, isString } from "remeda";

import { EvaluationDetailsTableData } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export interface ProcedureReferences {
  referenceIds: string[];
  businessModule: ApiBusinessModule;
}

export function mapProcedureReferences({
  tableData,
  attributes,
}: {
  tableData: EvaluationDetailsTableData;
  attributes: FlatAttribute[];
}): ProcedureReferences | undefined {
  const procedureReferenceAttribute = attributes.find(
    (attribute) => attribute.type === "ProcedureReferenceAttribute",
  );

  if (isDefined(procedureReferenceAttribute)) {
    return {
      businessModule: procedureReferenceAttribute.businessModule,
      referenceIds: tableData
        .map((row) => row[procedureReferenceAttribute.key])
        .filter(isString),
    };
  }

  return undefined;
}
