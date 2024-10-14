/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useState } from "react";

import {
  DiagramType,
  EvaluationDiagram,
  EvaluationDiagramBarChart,
  EvaluationDiagramChoroplethMap,
  EvaluationDiagramConfiguration,
  EvaluationDiagramHistogram,
  EvaluationDiagramLineChart,
  EvaluationDiagramPieChart,
  EvaluationDiagramScatterChart,
} from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { EvaluationDiagramBox } from "@/lib/businessModules/statistics/components/shared/EvaluationAccordion/EvaluationDiagramBox";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { ChoroplethMap } from "@/lib/businessModules/statistics/components/shared/charts/ChoroplethMap";
import { ChartApi } from "@/lib/businessModules/statistics/components/shared/charts/EChart";
import { Histogram } from "@/lib/businessModules/statistics/components/shared/charts/Histogram";
import { LineChart } from "@/lib/businessModules/statistics/components/shared/charts/LineChart";
import { PieChart } from "@/lib/businessModules/statistics/components/shared/charts/PieChart";
import { ScatterChart } from "@/lib/businessModules/statistics/components/shared/charts/ScatterChart";
import { ImageType } from "@/lib/businessModules/statistics/components/shared/charts/types";
import { BaseModal } from "@/lib/shared/components/BaseModal";

export function EvaluationChartDiagram(props: {
  configuration: EvaluationDiagramConfiguration;
  evaluationDiagram: EvaluationDiagram;
  evaluatedDataAmountTotal: number;
  isReport: boolean;
}) {
  const [eChartApi, setEChartApi] = useState<ChartApi | null>(null);

  function onExportAsImage(wantedImageType: ImageType) {
    if (!eChartApi) {
      return;
    }

    eChartApi.exportAsImage(wantedImageType);
  }

  function getChart() {
    switch (props.configuration.type) {
      case DiagramType.PIE_CHART:
        return (
          <PieChart
            filterSetData={
              props.evaluationDiagram.data as EvaluationDiagramPieChart["data"]
            }
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.LINE_CHART:
        return (
          <LineChart
            diagram={
              (props.evaluationDiagram as EvaluationDiagramLineChart).data
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.SCATTER_CHART:
        return (
          <ScatterChart
            filterSet={
              (props.evaluationDiagram as EvaluationDiagramScatterChart).data
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.BAR_CHART:
        return (
          <BarChart
            filterSetData={
              props.evaluationDiagram.data as EvaluationDiagramBarChart["data"]
            }
            grouping={props.configuration.grouping}
            scaling={props.configuration.scaling}
            orientation={props.configuration.orientation}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.HISTOGRAM_CHART:
        return (
          <Histogram
            diagramData={
              props.evaluationDiagram.data as EvaluationDiagramHistogram["data"]
            }
            configuration={props.configuration}
            eChartApi={setEChartApi}
          />
        );
      case DiagramType.CHOROPLETH_CHART:
        return (
          <ChoroplethMap
            diagramData={
              props.evaluationDiagram
                .data as EvaluationDiagramChoroplethMap["data"]
            }
            configuration={props.configuration}
            geoJson={
              (props.evaluationDiagram as EvaluationDiagramChoroplethMap)
                .geoJson
            }
            eChartApi={setEChartApi}
          />
        );
    }
  }

  const [openFullScreenChart, setOpenFullScreenChart] = useState(false);
  const chart = getChart();
  return (
    <>
      <BaseModal
        open={openFullScreenChart}
        onClose={() => setOpenFullScreenChart(false)}
        modalTitle={props.evaluationDiagram.title}
        sx={{
          width: "95vw",
          height: "85vh",
          marginTop: "2.25rem",
        }}
      >
        {chart}
      </BaseModal>
      <EvaluationDiagramBox
        diagramId={props.evaluationDiagram.diagramId}
        title={props.evaluationDiagram.title}
        description={props.evaluationDiagram.description}
        filterLabels={props.evaluationDiagram.filterLabels}
        evaluatedDataAmount={props.evaluationDiagram.evaluatedDataAmount}
        evaluatedDataAmountTotal={props.evaluatedDataAmountTotal}
        onExportAsImage={onExportAsImage}
        isReport={props.isReport}
        openChartInFullScreenDialog={() => setOpenFullScreenChart(true)}
      >
        {chart}
      </EvaluationDiagramBox>
    </>
  );
}
