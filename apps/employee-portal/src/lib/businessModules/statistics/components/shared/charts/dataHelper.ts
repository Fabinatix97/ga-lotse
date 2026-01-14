/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isDefined } from "remeda";

import {
  AnalysisDiagramLineChart,
  AnalysisDiagramScatterChart,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

import { XYAxes } from "./types";

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

function getTextWidth(text: string) {
  const charWidths = new Map<string, number>([
    ["f", 4],
    ["i", 3],
    ["j", 4],
    ["l", 3],
    ["m", 11],
    ["r", 4],
    ["t", 4],
    ["w", 11],
    ["A", 8],
    ["B", 8],
    ["C", 9],
    ["D", 9],
    ["E", 8],
    ["F", 8],
    ["G", 9],
    ["H", 9],
    ["I", 4],
    ["J", 5],
    ["K", 8],
    ["L", 7],
    ["M", 11],
    ["N", 9],
    ["O", 9],
    ["P", 8],
    ["Q", 9],
    ["R", 8],
    ["S", 8],
    ["T", 8],
    ["U", 9],
    ["V", 8],
    ["W", 11],
    ["X", 8],
    ["Y", 8],
    ["Z", 8],
    [" ", 3],
    [".", 3],
    [",", 3],
    ["!", 3],
    ["?", 6],
    ["-", 4],
    ["1", 4],
  ]);

  return text
    .split("")
    .reduce((acc, character) => acc + (charWidths.get(character) ?? 7), 0);
}

function splitWordEqually(word: string, maxWidth: number) {
  // Determine Split point
  const averageCharsFittingWidth = Math.floor(
    maxWidth / (getTextWidth(word) / word.length),
  );
  let amountOfSplits = 1;
  for (
    ;
    word.length / amountOfSplits > averageCharsFittingWidth;
    ++amountOfSplits
  ) {}

  // Split words
  const splitInterval = Math.ceil(word.length / amountOfSplits);
  const splitWords = [];
  let splitIndex = 0;
  for (
    ;
    splitIndex + splitInterval < word.length;
    splitIndex += splitInterval
  ) {
    splitWords.push(word.slice(splitIndex, splitIndex + splitInterval) + "-");
  }
  splitWords.push(word.slice(splitIndex));

  return splitWords;
}

export function formatChartLabel(text: string, maxWidth: number) {
  return text
    .split(/\s|(?<=-)/)
    .flatMap((it) => {
      if (getTextWidth(it) > maxWidth) {
        return splitWordEqually(it, maxWidth);
      }
      return [it];
    })
    .reduce((acc, currentValue) => {
      if (
        acc.length > 0 &&
        getTextWidth([...acc[acc.length - 1]!, currentValue].join(" ")) <
          maxWidth
      ) {
        return [
          ...acc.slice(0, acc.length - 1),
          [...acc[acc.length - 1]!, currentValue],
        ];
      }
      return [...acc, [currentValue]];
    }, [] as string[][])
    .map((it) => it.join(" "))
    .join("\n")
    .replaceAll("- ", "-");
}

export function mapAxisTitleWithOptionalUnit(attribute: XYAxes) {
  return formatChartLabel(
    isDefined(attribute.unit)
      ? `${attribute.name} [${attribute.unit}]`
      : attribute.name,
    300,
  );
}

export function calculateRelativeFormatting(value: number): string {
  return (value * 100).toFixed(2) + "%";
}
