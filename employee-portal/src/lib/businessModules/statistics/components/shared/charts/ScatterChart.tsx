/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption, SeriesOption } from "echarts";
import { unique } from "remeda";

import {
  EvaluationDiagramScatterChart,
  EvaluationScatterDiagramConfiguration,
} from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { chartLegend } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import {
  calculateXYMinMax,
  mapAxisTitleWithOptionalUnit,
} from "@/lib/businessModules/statistics/components/shared/charts/dataHelper";

interface ScatterChartDiagramProps {
  filterSet: EvaluationDiagramScatterChart["data"];
  configuration: EvaluationScatterDiagramConfiguration;
  eChartApi?: (eChartApi: ChartApi) => void;
}

export function ScatterChart({
  filterSet,
  configuration,
  eChartApi,
}: ScatterChartDiagramProps) {
  const series: SeriesOption[] = filterSet.map((group) => ({
    data: group.dataPoints.map((it) => [it.x, it.y]),
    name: group.label,
    type: "scatter",
  }));

  if (configuration.trendline) {
    for (const group of filterSet) {
      series.push({
        type: "line",
        name: group.label,
        data: unique(group.dataPoints.map((it) => it.x)).map((it) => [
          it,
          group.trendline
            ? group.trendline.offset + group.trendline.slope * it
            : undefined,
        ]),
      });
    }
  }

  const [xMin, xMax, yMin, yMax] = calculateXYMinMax(filterSet);
  const option: EChartsOption = {
    legend: chartLegend,
    xAxis: {
      name: mapAxisTitleWithOptionalUnit(configuration.xAttribute),
      nameTextStyle: {
        fontWeight: 600,
      },
      type:
        configuration.xAttribute.type === "DateAttribute" ? "time" : "value",
      min: configuration.axisRange === "ADAPTED" ? xMin : undefined,
      max: configuration.axisRange === "ADAPTED" ? xMax : undefined,
    },
    yAxis: {
      name: mapAxisTitleWithOptionalUnit(configuration.yAttribute),
      nameTextStyle: {
        fontWeight: 600,
      },
      type:
        configuration.yAttribute.type === "DateAttribute" ? "time" : "value",
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
