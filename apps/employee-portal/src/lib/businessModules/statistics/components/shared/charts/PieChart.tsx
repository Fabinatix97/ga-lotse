/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption } from "echarts";

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
        center: ["50%", "50%"],
      },
    ],
  };

  return <EChart option={option} chartApi={eChartApi} />;
}
