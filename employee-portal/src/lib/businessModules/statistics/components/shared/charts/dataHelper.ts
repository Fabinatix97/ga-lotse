/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  AnalysisDiagramLineChart,
  AnalysisDiagramScatterChart,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export function calculateXYMinMax(
  filterSet:
    | AnalysisDiagramScatterChart["data"]
    | AnalysisDiagramLineChart["data"],
) {
  const xList = filterSet.flatMap((it) => it.dataPoints.flatMap((it) => it.x));
  const xMin = Math.min(...xList);
  const xMax = Math.max(...xList);
  const yList = filterSet.flatMap((it) => it.dataPoints.flatMap((it) => it.y));
  const yMin = Math.min(...yList);
  const yMax = Math.max(...yList);
  return [xMin, xMax, yMin, yMax];
}

export function formatBreakLongStringOnce(input: string) {
  if (input.length <= 30) {
    return input;
  }

  const textParts = input.split(" ");
  const middle = Math.round(textParts.length / 2);
  const topPart = textParts.slice(0, middle).join(" ");
  const bottomPart = textParts.slice(middle).join(" ");
  return topPart + "\n" + bottomPart;
}

export function mapAxisTitleWithOptionalUnit(attribute: FlatAttribute) {
  return (attribute.type === "DecimalAttribute" ||
    attribute.type === "IntegerAttribute") &&
    isDefined(attribute.unit)
    ? `${formatBreakLongStringOnce(attribute.name)} [${attribute.unit}]`
    : formatBreakLongStringOnce(attribute.name);
}

export function calculateRelativeFormatting(value: number): string {
  return (value * 100).toFixed(2) + "%";
}
