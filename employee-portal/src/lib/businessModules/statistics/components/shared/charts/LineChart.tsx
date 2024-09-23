/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption, SeriesOption } from "echarts";

import {
  EvaluationDiagramLineChart,
  EvaluationLineDiagramConfiguration,
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

interface LineChartDiagramProps {
  diagram: EvaluationDiagramLineChart["data"];
  configuration: EvaluationLineDiagramConfiguration;
  eChartApi?: (eChartApi: ChartApi) => void;
}

export function compareAttribute(
  l: { x: number; y: number },
  r: {
    x: number;
    y: number;
  },
): -1 | 1 | 0 {
  if (l.x < r.x) {
    return -1;
  } else if (l.x === r.x && l.y < r.y) {
    return -1;
  } else if (l.x === r.x && l.y === r.y) {
    return 0;
  }
  return 1;
}

export function LineChart(props: LineChartDiagramProps) {
  const series: SeriesOption[] = props.diagram.map((group) => ({
    data: group.dataPoints.sort(compareAttribute).map((it) => [it.x, it.y]),
    name: group.label,
    type: "line",
  }));

  const [xMin, xMax, yMin, yMax] = calculateXYMinMax(props.diagram);
  const option: EChartsOption = {
    legend: chartLegend,
    xAxis: {
      name: mapAxisTitleWithOptionalUnit(props.configuration.xAttribute),
      nameTextStyle: {
        fontWeight: 600,
      },
      type:
        props.configuration.xAttribute.type === "DateAttribute"
          ? "time"
          : "value",
      min: props.configuration.axisRange === "ADAPTED" ? xMin : undefined,
      max: props.configuration.axisRange === "ADAPTED" ? xMax : undefined,
    },
    yAxis: {
      name: mapAxisTitleWithOptionalUnit(props.configuration.yAttribute),
      nameTextStyle: {
        fontWeight: 600,
      },
      type:
        props.configuration.yAttribute.type === "DateAttribute"
          ? "time"
          : "value",
      min: props.configuration.axisRange === "ADAPTED" ? yMin : undefined,
      max: props.configuration.axisRange === "ADAPTED" ? yMax : undefined,
    },
    series: series,
    tooltip: {
      trigger: "axis",
    },
  };
  return <EChart option={option} chartApi={props.eChartApi} />;
}
