/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption, MapSeriesOption, registerMap } from "echarts";
import { useState } from "react";
import { isNonNullish, randomString } from "remeda";

import {
  AnalysisDiagramChoroplethMap,
  DiagramCharacteristicParameter,
  DiagramColorScheme,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { getChoroplethAggregationMethod } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";

interface ChoroplethMapProps {
  diagramData: AnalysisDiagramChoroplethMap["data"];
  colorScheme: DiagramColorScheme;
  characteristicParameter?: DiagramCharacteristicParameter;
  geoJson: string;
  eChartApi?: (eChartApi: ChartApi) => void;
  additionalEchartsSeriesOptions?: Partial<MapSeriesOption>;
}

export function getDefinedDiagramValues(
  diagramData: AnalysisDiagramChoroplethMap["data"],
) {
  return diagramData
    .map((datapoint) => datapoint.value)
    .filter((value) => isNonNullish(value));
}

export function getMinimum(values: number[]) {
  return values.length > 0 ? Math.min(...values) : 0;
}

export function getMaximum(values: number[]) {
  return values.length > 0 ? Math.max(...values) : 1;
}

function getColor(colorScheme: DiagramColorScheme) {
  switch (colorScheme) {
    case "UNIFORM":
      return ["#ffffff", "#3fb1e3", "#626c91"];
    case "GREEN2BLUE":
      return ["#1daf81", "#c4ebad", "#ffffff", "#3fb1e3", "#626c91"];
    case "BLUE2GREEN":
      return ["#626c91", "#3fb1e3", "#ffffff", "#c4ebad", "#1daf81"];
  }
}

export function getPrecision(min: number, max: number) {
  const log10 = Math.log10(max - min);
  return log10 < 1 ? Math.round(Math.abs(log10)) + 1 : 0;
}

export function ChoroplethMap(props: ChoroplethMapProps) {
  const [mapId] = useState<string>(randomString(10));
  registerMap(mapId, props.geoJson);

  const values = getDefinedDiagramValues(props.diagramData);
  const min = getMinimum(values);
  const max = getMaximum(values);

  const option: EChartsOption = {
    visualMap: {
      left: "right",
      min: min * 0.9999999,
      max: max * 1.0000001, //Otherwise the map breaks if min=max
      inRange: {
        color: getColor(props.colorScheme),
      },
      text: [
        `${getChoroplethAggregationMethod(props.characteristicParameter)}\n\n${max}`,
        min.toString(),
      ],
      textGap: 5,
      precision: getPrecision(min, max),
    },

    series: [
      {
        name: getChoroplethAggregationMethod(props.characteristicParameter),
        type: "map" as const,
        map: mapId,
        data: props.diagramData,
        roam: true,
        select: { disabled: true },
        emphasis: { label: { show: false } },
        ...(props.additionalEchartsSeriesOptions ?? {}),
      },
    ],
    legend: undefined,
  };

  return <EChart option={option} chartApi={props.eChartApi} />;
}
