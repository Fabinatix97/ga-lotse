/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption } from "echarts";
import { isArray, sum } from "remeda";

import {
  AnalysisDiagramBarChart,
  DiagramGrouping,
  DiagramOrientation,
  DiagramScaling,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { evaluateGrouping } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";
import {
  calculateRelativeFormatting,
  formatChartLabel,
} from "@/lib/businessModules/statistics/components/shared/charts/dataHelper";

interface BarChartProps {
  diagramData: AnalysisDiagramBarChart["data"];
  isDataGrouped: boolean;
  grouping?: DiagramGrouping;
  scaling: DiagramScaling;
  orientation?: DiagramOrientation;
  getColor?: (identifier: string) => string;
  eChartApi?: (eChartApi: ChartApi) => void;
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
      dataGroups[attribute.label] ??= [];
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

  if (isArray(data)) {
    const total = sum(data);
    return data.map((it) => mapToRelative(it, total));
  }

  const totals = Object.values(data).reduce(
    (acc, it) => {
      it.forEach(
        ({ groupLabel, value }) =>
          (acc[groupLabel] = (acc[groupLabel] ?? 0) + value),
      );
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(data).reduce(
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

export function BarChart(props: BarChartProps) {
  const grouping = evaluateGrouping(props.grouping, props.scaling);
  const series = props.isDataGrouped
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
      formatter: (text: string) => {
        if (props.orientation === "VERTICAL") {
          return formatChartLabel(text, 100);
        }
        return formatChartLabel(text, 330);
      },
      hideOverlap: false,
      interval: props.orientation === "VERTICAL" ? 0 : undefined,
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
    series: props.isDataGrouped
      ? Object.keys(series.data).map((serie) => {
          return {
            name: serie,
            type: "bar",
            data: (series.data as DataGroups)[serie]!.map((it) => it.value),
            stack: grouping,
            itemStyle: {
              color: props.getColor?.(serie),
            },
          };
        })
      : [
          {
            type: "bar",
            data: series.data as number[],
          },
        ],
  };

  return <EChart option={option} chartApi={props.eChartApi} />;
}
