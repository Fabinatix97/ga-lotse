/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption } from "echarts";

import {
  AnalysisDiagramBarChart,
  DiagramGrouping,
  DiagramOrientation,
  DiagramScaling,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import {
  calculateRelativeFormatting,
  formatBreakLongStringOnce,
} from "@/lib/businessModules/statistics/components/shared/charts/dataHelper";

export interface BarChartProps {
  diagramData: AnalysisDiagramBarChart["data"];
  grouping?: DiagramGrouping;
  scaling?: DiagramScaling;
  orientation?: DiagramOrientation;
  eChartApi?: (eChartApi: ChartApi) => void;
  barWidth?: string;
  barGap?: number;
  type?: DiagramType.BAR_CHART | DiagramType.HISTOGRAM_CHART;
}

export function mapToUnstackedSeries(
  diagramData: AnalysisDiagramBarChart["data"],
) {
  const labels: string[] = [];
  const data: number[] = [];

  for (const group of diagramData) {
    labels.push(group.label);
    data.push(group.attributes[0]!.value);
  }

  return {
    labels: labels,
    data: data,
  };
}

type DataGroups = Record<string, { groupLabel: string; value: number }[]>;

export function mapToStackedSeries(
  diagramData: AnalysisDiagramBarChart["data"],
) {
  const labels: string[] = [];
  const dataGroups: DataGroups = {};

  diagramData.forEach((item) => {
    labels.push(item.label);
    item.attributes.forEach((attribute) => {
      if (!dataGroups[attribute.label]) {
        dataGroups[attribute.label] = [];
      }
      dataGroups[attribute.label]!.push({
        groupLabel: item.label,
        value: attribute.value,
      });
    });
  });
  return {
    labels: labels,
    data: dataGroups,
  };
}

export function transformToRelativeData(data: DataGroups | number[]) {
  function mapToRelative(value: number, total: number) {
    if (total === 0) {
      return 0;
    }
    return value / total;
  }

  const dataGroups = data as DataGroups;
  const totals = Object.values(dataGroups).reduce(
    (acc, it) => {
      it.forEach(
        ({ groupLabel, value }) =>
          (acc[groupLabel] = (acc[groupLabel] ?? 0) + value),
      );
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(dataGroups).reduce(
    (acc, [key, val]) => ({
      ...acc,
      [key]: val.map(({ groupLabel, value }) => ({
        groupLabel,
        value: mapToRelative(value, totals[groupLabel]!),
      })),
    }),
    {},
  );
}

function evaluateGrouping(
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

export function BarChart(props: BarChartProps) {
  const grouping = evaluateGrouping(props.grouping, props.scaling);
  const isStackedSeries = (props.diagramData[0]?.attributes?.length ?? 0) > 1;
  const series = isStackedSeries
    ? mapToStackedSeries(props.diagramData)
    : mapToUnstackedSeries(props.diagramData);

  if (props.scaling === "RELATIVE") {
    series.data = transformToRelativeData(series.data);
  }

  function formatter(value: number) {
    return props.scaling !== "RELATIVE"
      ? `${value}`
      : calculateRelativeFormatting(value);
  }

  const categoryAxisOption: EChartsOption["xAxis"] & EChartsOption["yAxis"] = {
    type: "category",
    data: series.labels,
    axisLabel: {
      ...(props.orientation === "VERTICAL" &&
      props.type !== DiagramType.HISTOGRAM_CHART
        ? {
            hideOverlap: false,
            interval: 0,
            width: 100,
            overflow: "break",
          }
        : {}),
      ...(props.orientation === "HORIZONTAL"
        ? {
            formatter: formatBreakLongStringOnce,
          }
        : {}),
    },
    axisLine: {
      show: props.type === DiagramType.HISTOGRAM_CHART,
    },
    axisTick: {
      show: props.type === DiagramType.HISTOGRAM_CHART,
      interval: 0,
    },
    splitLine: {
      show: props.type === DiagramType.HISTOGRAM_CHART,
      interval: 0,
    },
  };
  const valueAxisOption: EChartsOption["xAxis"] & EChartsOption["yAxis"] = {
    type: "value",
    splitLine: { show: true },
    axisLabel: {
      formatter,
    },
  };

  const axis: EChartsOption =
    props.orientation === "VERTICAL"
      ? ({
          xAxis: categoryAxisOption,
          yAxis: valueAxisOption,
        } satisfies EChartsOption)
      : {
          yAxis: categoryAxisOption,
          xAxis: valueAxisOption,
        };

  const option: EChartsOption = {
    ...axis,
    tooltip: {
      show: true,
      valueFormatter: (params) => formatter(params as number),
    },
    grid: {
      containLabel: true,
    },
    series: isStackedSeries
      ? Object.keys(series.data).map((serie) => {
          return {
            name: serie,
            type: "bar",
            data: (series.data as DataGroups)[serie]!.map((it) => it.value),
            stack: grouping,
            barWidth: props.barWidth,
            barGap: props.barGap,
          };
        })
      : [
          {
            type: "bar",
            data: series.data as number[],
            barWidth: props.barWidth,
            barGap: props.barGap,
          },
        ],
  };

  return <EChart option={option} chartApi={props.eChartApi} />;
}
