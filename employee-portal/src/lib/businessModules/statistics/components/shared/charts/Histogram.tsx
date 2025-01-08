/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  AnalysisDiagramBarChart,
  AnalysisDiagramHistogram,
  DiagramGrouping,
  DiagramScaling,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { ChartApi } from "@/lib/businessModules/statistics/components/shared/charts/EChart";

interface HistogramProps {
  diagramData: AnalysisDiagramHistogram["data"];
  grouping?: DiagramGrouping;
  scaling?: DiagramScaling;
  eChartApi?: (eChartApi: ChartApi) => void;
}

export function mapToBarChartDiagramData(
  diagramData: AnalysisDiagramHistogram["data"],
): AnalysisDiagramBarChart["data"] {
  // On a 1920 width display 15 Bars barely fit the whole label
  const tooManyBars = diagramData.length > 15;
  return diagramData
    .toSorted((l, r) => l.min - r.min)
    .map((it) => ({
      label: tooManyBars
        ? `${it.min.toFixed(2)}`
        : `${it.min.toFixed(2)} - ${it.max.toFixed(2)}`,
      attributes: it.attributes,
    }));
}

export function Histogram(props: HistogramProps) {
  const data = mapToBarChartDiagramData(props.diagramData);
  const numAttributes = props.diagramData[0]?.attributes?.length ?? 1;
  const barWidth =
    props.grouping === "STACKED" ? "99.8%" : `${99.8 / numAttributes}%`;

  return (
    <BarChart
      diagramData={data}
      grouping={props.grouping}
      scaling={props.scaling}
      orientation={"VERTICAL"}
      eChartApi={props.eChartApi}
      barGap={0}
      barWidth={barWidth}
      type={DiagramType.HISTOGRAM_CHART}
    />
  );
}
