/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { ApiValueOption } from "@eshg/statistics-api";

import { EvaluationDetailsTableValue } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export function mapRawValueToTableCell(
  rawValue: EvaluationDetailsTableValue,
  valueType: FlatAttribute["type"],
  valueOptions?: ApiValueOption[],
) {
  if (!isDefined(rawValue)) {
    return "";
  }
  switch (valueType) {
    case "BooleanAttribute":
      return rawValue === true ? "Ja" : rawValue === false ? "Nein" : "";
    case "ValueWithOptionsAttribute":
      return (
        valueOptions?.find((option) => option.value === rawValue)?.meaning ??
        rawValue
      );
    default:
      return rawValue;
  }
}
