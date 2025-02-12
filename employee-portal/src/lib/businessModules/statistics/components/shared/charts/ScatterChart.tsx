/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption, SeriesOption } from "echarts";
import { unique } from "remeda";

import { AnalysisDiagramScatterChart } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import {
  calculateXYMinMax,
  mapAxisTitleWithOptionalUnit,
} from "@/lib/businessModules/statistics/components/shared/charts/dataHelper";

import { NumericAxesConfiguration } from "./types";

interface ScatterChartDiagramProps {
  diagramData: AnalysisDiagramScatterChart["data"];
  configuration: NumericAxesConfiguration;
  eChartApi?: (eChartApi: ChartApi) => void;
}

export function ScatterChart({
  diagramData,
  configuration,
  eChartApi,
}: ScatterChartDiagramProps) {
  const series: SeriesOption[] = diagramData.map((group) => ({
    data: group.dataPoints.map((it) => [it.x, it.y]),
    name: group.label,
    type: "scatter",
  }));

  for (const group of diagramData.filter((it) => it.trendline)) {
    series.push({
      type: "line",
      name: group.label,
      data: unique(group.dataPoints.map((it) => it.x)).map((it) => [
        it,
        group.trendline!.offset + group.trendline!.slope * it,
      ]),
    });
  }

  const [xMin, xMax, yMin, yMax] = calculateXYMinMax(diagramData);
  const option: EChartsOption = {
    grid: {
      containLabel: true,
    },
    xAxis: {
      name: mapAxisTitleWithOptionalUnit(configuration.xAttribute),
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 600,
      },
      type: "value",
      min: configuration.axisRange === "ADAPTED" ? xMin : undefined,
      max: configuration.axisRange === "ADAPTED" ? xMax : undefined,
    },
    yAxis: {
      name: mapAxisTitleWithOptionalUnit(configuration.yAttribute),
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 600,
      },
      type: "value",
      min: configuration.axisRange === "ADAPTED" ? yMin : undefined,
      max: configuration.axisRange === "ADAPTED" ? yMax : undefined,
    },
    series: series,
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => (value as number).toFixed(2),
    },
  };
  return <EChart option={option} chartApi={eChartApi} />;
}
