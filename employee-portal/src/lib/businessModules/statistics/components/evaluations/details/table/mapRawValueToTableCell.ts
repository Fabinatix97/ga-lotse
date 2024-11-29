/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiValueOption } from "@eshg/employee-portal-api/statistics";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { isDate } from "date-fns";
import { isDefined } from "remeda";

import { EvaluationDetailsTableValue } from "@/lib/businessModules/statistics/api/models/evaluationDetailsTableData";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export function mapRawValueToTableCell(
  rawValue: EvaluationDetailsTableValue,
  valueType: FlatAttribute["type"],
  valueOptions?: ApiValueOption[],
  locale?: string,
) {
  if (!isDefined(rawValue)) {
    return "";
  }
  switch (valueType) {
    case "BooleanAttribute":
      return rawValue === true ? "Ja" : rawValue === false ? "Nein" : "";
    case "DateAttribute":
      if (isDate(rawValue)) {
        return formatDate(rawValue, locale);
      }
      return rawValue;
    case "ValueWithOptionsAttribute":
      return (
        valueOptions?.find((option) => option.value === rawValue)?.meaning ??
        rawValue
      );
    default:
      return rawValue;
  }
}
