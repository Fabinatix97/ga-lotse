/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption, SeriesOption } from "echarts";

import {
  AnalysisDiagramLineChart,
  AnalysisLineDiagramConfiguration,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import {
  calculateXYMinMax,
  mapAxisTitleWithOptionalUnit,
} from "@/lib/businessModules/statistics/components/shared/charts/dataHelper";

interface LineChartDiagramProps {
  diagramData: AnalysisDiagramLineChart["data"];
  configuration: Pick<
    AnalysisLineDiagramConfiguration,
    "axisRange" | "xAttribute" | "yAttribute"
  >;
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
  const series: SeriesOption[] = props.diagramData.map((group) => ({
    data: group.dataPoints.sort(compareAttribute).map((it) => [it.x, it.y]),
    name: group.label,
    type: "line",
  }));

  const [xMin, xMax, yMin, yMax] = calculateXYMinMax(props.diagramData);
  const option: EChartsOption = {
    grid: {
      containLabel: true,
    },
    xAxis: {
      name: mapAxisTitleWithOptionalUnit(props.configuration.xAttribute),
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 600,
      },
      type: "value",
      min: props.configuration.axisRange === "ADAPTED" ? xMin : undefined,
      max: props.configuration.axisRange === "ADAPTED" ? xMax : undefined,
    },
    yAxis: {
      name: mapAxisTitleWithOptionalUnit(props.configuration.yAttribute),
      nameLocation: "middle",
      nameGap: 40,
      nameTextStyle: {
        fontWeight: 600,
      },
      type: "value",
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
