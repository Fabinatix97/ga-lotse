/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption } from "echarts";
import { CallbackDataParams } from "echarts/types/dist/shared";
import { isNumber, isString } from "remeda";

import { AnalysisDiagramPieChart } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";

interface PieChartProps {
  diagramData: AnalysisDiagramPieChart["data"];
  getColor?: (identifier: string) => string;
  eChartApi?: (eChartApi: ChartApi) => void;
}

function formatValue(params: CallbackDataParams) {
  const value = isNumber(params.value) ? params.value.toString() : "-";
  if (params.percent) return `${value} (${params.percent}%)`;
  return value;
}

function tooltipFormatter(params: CallbackDataParams) {
  const marker = isString(params.marker) ? params.marker : "";
  const name = `<span style="margin-left: 2px">${params.name}</span>`;
  const formattedValue = formatValue(params);
  const value = `<span style="float: right; margin-left: 20px; font-weight: 900">${formattedValue}</span>`;
  return `${marker}${name}${value}`;
}

export function PieChart({ diagramData, getColor, eChartApi }: PieChartProps) {
  const portions = diagramData.map((it) => ({
    name: it.label,
    value: it.value,
  }));

  const option: EChartsOption = {
    series: [
      {
        type: "pie",
        top: 50,
        data: portions.map((portion) =>
          portion.value === 0
            ? {
                ...portion,
                label: { show: false },
                itemStyle: { color: getColor?.(portion.name) },
              }
            : {
                ...portion,
                itemStyle: { color: getColor?.(portion.name) },
              },
        ),
        label: {
          color: "#171A1C", // text.primary
        },
        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: 2,
        },
        tooltip: {
          formatter: tooltipFormatter,
        },
        center: ["50%", "50%"],
      },
    ],
  };

  return <EChart option={option} chartApi={eChartApi} />;
}
