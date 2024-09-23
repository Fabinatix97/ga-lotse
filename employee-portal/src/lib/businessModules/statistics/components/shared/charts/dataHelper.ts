/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import {
  EvaluationDiagramLineChart,
  EvaluationDiagramScatterChart,
} from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";

export function calculateXYMinMax(
  filterSet:
    | EvaluationDiagramScatterChart["data"]
    | EvaluationDiagramLineChart["data"],
) {
  const xList = filterSet.flatMap((it) => it.dataPoints.flatMap((it) => it.x));
  const xMin = Math.min(...xList);
  const xMax = Math.max(...xList);
  const yList = filterSet.flatMap((it) => it.dataPoints.flatMap((it) => it.y));
  const yMin = Math.min(...yList);
  const yMax = Math.max(...yList);
  return [xMin, xMax, yMin, yMax];
}

export function mapAxisTitleWithOptionalUnit(attribute: FlatAttribute) {
  return (attribute.type === "DecimalAttribute" ||
    attribute.type === "IntegerAttribute") &&
    isDefined(attribute.unit)
    ? `${attribute.name} [${attribute.unit}]`
    : attribute.name;
}

export function calculateRelativeFormatting(value: number): string {
  return (value * 100).toFixed(2) + "%";
}
