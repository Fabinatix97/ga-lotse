/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BarChartOutlined,
  PieChartOutline,
  PollOutlined,
  ScatterPlotOutlined,
  ShowChartOutlined,
  SvgIconComponent,
  TravelExploreOutlined,
} from "@mui/icons-material";

import { EnumMap } from "@eshg/lib-portal";

import {
  DiagramAxisRange,
  DiagramBinning,
  DiagramCharacteristicParameter,
  DiagramColorScheme,
  DiagramGrouping,
  DiagramOrientation,
  DiagramScaling,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";

import { AttributeType } from "./types";

export const colorSchemeNames: EnumMap<DiagramColorScheme> = {
  UNIFORM: "Uniform",
  GREEN2BLUE: "Grün nach blau",
  BLUE2GREEN: "Blau nach grün",
};

export const diagramTypeNames: EnumMap<DiagramType> = {
  BAR_CHART: "Balkendiagramm",
  CHOROPLETH_CHART: "Choroplethenkarte",
  HISTOGRAM_CHART: "Histogramm",
  LINE_CHART: "Liniendiagramm",
  PIE_CHART: "Kreisdiagramm",
  SCATTER_CHART: "Streudiagramm",
};

export const diagramTypeIcons: EnumMap<DiagramType, SvgIconComponent> = {
  BAR_CHART: BarChartOutlined,
  CHOROPLETH_CHART: TravelExploreOutlined,
  HISTOGRAM_CHART: PollOutlined,
  LINE_CHART: ShowChartOutlined,
  PIE_CHART: PieChartOutline,
  SCATTER_CHART: ScatterPlotOutlined,
};

export const orientationValueNames: EnumMap<DiagramOrientation> = {
  VERTICAL: "Vertikal",
  HORIZONTAL: "Horizontal",
};

export const groupingValueNames: EnumMap<DiagramGrouping> = {
  GROUPED: "Gruppiert",
  STACKED: "Gestapelt",
};

export const scalingValueNames: EnumMap<DiagramScaling> = {
  ABSOLUTE: "Absolut",
  RELATIVE: "Relativ",
};

export const axisRangeValueNames: EnumMap<DiagramAxisRange> = {
  ADAPTED: "Angepasst",
  ORIGIN: "Achsenursprung",
};

export const binningValueNames: EnumMap<DiagramBinning> = {
  AUTO: "Auto",
  MANUAL: "Manuell",
};

export const choroplethAggregationMethodValueNames: EnumMap<DiagramCharacteristicParameter> =
  {
    MEAN: "Mittelwert",
    SUM: "Summe",
  };

export function getChoroplethAggregationMethod(
  characteristicParameter?: DiagramCharacteristicParameter,
) {
  return characteristicParameter
    ? choroplethAggregationMethodValueNames[characteristicParameter]
    : "Häufigkeit";
}

export function isBoolean(valueType: AttributeType) {
  return valueType === "BooleanAttribute";
}

export function isValueWithOptions(valueType: AttributeType) {
  return valueType === "ValueWithOptionsAttribute";
}

export function isText(valueType: AttributeType) {
  return valueType === "TextAttribute";
}

function isDate(valueType: AttributeType) {
  return valueType === "DateAttribute";
}

export function isCategorical(valueType: AttributeType) {
  return (
    isBoolean(valueType) ||
    isValueWithOptions(valueType) ||
    isText(valueType) ||
    isDate(valueType) ||
    isInteger(valueType) ||
    isIntegerInterval(valueType)
  );
}

function isInteger(valueType: AttributeType) {
  return valueType === "IntegerAttribute";
}

export function isNumeric(valueType: AttributeType) {
  return (
    valueType === "DecimalAttribute" ||
    isInteger(valueType) ||
    isInterval(valueType)
  );
}

function isInterval(valueType: AttributeType) {
  return isDecimalInterval(valueType) || isIntegerInterval(valueType);
}

function isIntegerInterval(valueType: AttributeType) {
  return valueType === "IntegerIntervalAttribute";
}

function isDecimalInterval(valueType: AttributeType) {
  return valueType === "DecimalIntervalAttribute";
}

export function evaluateGrouping(
  grouping: DiagramGrouping | undefined,
  scaling: DiagramScaling | undefined,
) {
  if (grouping === "STACKED") {
    if (scaling === "RELATIVE") {
      return "total";
    }
    return "x";
  }
  return undefined;
}
