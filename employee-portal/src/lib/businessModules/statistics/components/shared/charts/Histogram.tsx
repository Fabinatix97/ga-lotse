/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption, SeriesOption } from "echarts";

import {
  AnalysisDiagramHistogram,
  DiagramGrouping,
  DiagramScaling,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { evaluateGrouping } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import { calculateRelativeFormatting } from "@/lib/businessModules/statistics/components/shared/charts/dataHelper";

interface HistogramProps {
  diagramData: AnalysisDiagramHistogram["data"];
  grouping?: DiagramGrouping;
  scaling?: DiagramScaling;
  eChartApi?: (eChartApi: ChartApi) => void;
}

type DataGroups = Record<string, [number, number][]>;

export function mapToStackedSeries(
  diagramData: AnalysisDiagramHistogram["data"],
) {
  const dataGroups: DataGroups = {};
  const sortedData = diagramData.toSorted((l, r) => l.min - r.min);

  sortedData.forEach((item) => {
    item.attributes.forEach((attribute) => {
      if (!dataGroups[attribute.label]) {
        dataGroups[attribute.label] = [];
      }
      dataGroups[attribute.label]!.push([item.min, attribute.value]);
    });
  });
  return {
    min: sortedData[0]!.min,
    max: sortedData[sortedData.length - 1]!.max,
    dataGroups,
  };
}

function transformToRelativeData(dataGroups: DataGroups) {
  function mapToRelative(value: number, total: number) {
    if (total === 0) {
      return 0;
    }
    return value / total;
  }

  const totals = Object.keys(dataGroups).reduce(
    (acc, it) => {
      dataGroups[it]!.forEach(([x, y]) => {
        acc[x] = (acc[x] ?? 0) + y;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.keys(dataGroups).reduce(
    (acc, it) => ({
      ...acc,
      [it]: dataGroups[it]!.map(([x, y]) => [x, mapToRelative(y, totals[x]!)]),
    }),
    {},
  );
}

export function Histogram(props: HistogramProps) {
  const series = mapToStackedSeries(props.diagramData);
  const numAttributes = props.diagramData[0]?.attributes?.length ?? 1;
  const isStackedSeries = numAttributes > 1;
  const barWidth =
    props.grouping === "STACKED" ? "99.8%" : `${99.8 / numAttributes}%`;
  const grouping = evaluateGrouping(props.grouping, props.scaling);

  if (props.scaling === "RELATIVE") {
    series.dataGroups = transformToRelativeData(series.dataGroups);
  }

  function formatter(value: number) {
    return props.scaling !== "RELATIVE"
      ? `${value}`
      : calculateRelativeFormatting(value);
  }

  const seriesData = Object.keys(series.dataGroups).map((serie) => {
    return {
      name: serie,
      type: "bar",
      data: series.dataGroups[serie]!,
      stack: grouping,
      barWidth: barWidth,
      barGap: 0,
      xAxisIndex: 0,
    };
  }) satisfies SeriesOption[];

  const option: EChartsOption = {
    xAxis: [
      // We require two axis to trick ECharts to stack bars properly.
      // https://github.com/apache/echarts/issues/7937#issuecomment-375918207
      {
        type: "category",
        show: false,
      },
      {
        type: "value",
        min: series.min,
        max: series.max,
        position: "bottom",
      },
    ],
    yAxis: {
      type: "value",
      splitLine: { show: true },
      axisLabel: {
        formatter,
      },
      axisLine: {
        onZero: false,
      },
    },
    tooltip: {
      show: true,
      valueFormatter: (params) => formatter(params as number),
    },
    grid: {
      containLabel: true,
    },
    series: isStackedSeries
      ? seriesData
      : [
          {
            ...seriesData[0]!,
            name: undefined,
          },
        ],
  };

  return <EChart option={option} chartApi={props.eChartApi} />;
}
