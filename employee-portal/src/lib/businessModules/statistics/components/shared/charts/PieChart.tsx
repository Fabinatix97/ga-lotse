/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption } from "echarts";

import { AnalysisDiagramPieChart } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ChartApi,
  EChart,
} from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { chartLegend } from "@/lib/businessModules/statistics/components/shared/charts/chartHelper";

interface PieChartProps {
  filterSetData: AnalysisDiagramPieChart["data"];
  eChartApi?: (eChartApi: ChartApi) => void;
}

export function PieChart({ filterSetData, eChartApi }: PieChartProps) {
  const portions = filterSetData.map((it) => ({
    name: it.label,
    value: it.value,
  }));

  const option: EChartsOption = {
    legend: chartLegend,
    series: [
      {
        type: "pie",
        top: 50,
        data: portions.map((portion) =>
          portion.value === 0
            ? { ...portion, label: { show: false } }
            : portion,
        ),
        label: {
          color: "#171A1C", // text.primary
        },
        center: ["50%", "50%"],
      },
    ],
  };

  return <EChart option={option} chartApi={eChartApi} />;
}
