/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { DiagramType } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { EvaluationDiagramBox } from "@/lib/businessModules/statistics/components/shared/EvaluationAccordion/EvaluationDiagramBox";
import { BarChart } from "@/lib/businessModules/statistics/components/shared/charts/BarChart";
import { ScatterChart } from "@/lib/businessModules/statistics/components/shared/charts/ScatterChart";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";

export default function PlaygroundChartsPage() {
  const barChartMuchData = [];
  for (let i = 0; i < 50; i++) {
    barChartMuchData.push({
      label: i.toString(),
      attributes: [
        {
          label: "blau",
          value: 5,
        },
        {
          label: "grün",
          value: 8,
        },
        {
          label: "rot",
          value: 3,
        },
        {
          label: "gelb",
          value: 6,
        },
      ],
    });
  }

  const scatterChartData = [
    {
      label: "Gruppe 1",
      dataPoints: [
        { x: 1, y: 1000 },
        { x: 1, y: 1 },
        { x: 2, y: 7 },
        { x: 4, y: 4 },
        { x: 4, y: 3 },
        { x: 6, y: 8 },
        { x: 8, y: 2 },
      ],
      trendline: {
        offset: 3.8071065989847717,
        slope: 0.08629441624365483,
      },
    },
    {
      label: "Gruppe 2",
      dataPoints: [
        { x: 10, y: 1 },
        { x: 30, y: 12 },
        { x: 50, y: 6 },
        { x: 70, y: 8 },
        { x: 90, y: 3 },
      ],
      trendline: {
        offset: 6,
        slope: 0,
      },
    },
  ];

  return (
    <MainContentLayout>
      <Stack gap={2}>
        <EvaluationDiagramBox
          diagramId={"123"}
          evaluatedDataAmountTotal={100}
          title="Balkendiagramm mit vielen Werten"
          description="Hier könnte Ihre Werbung stehen"
          filterLabels={["Label 1", "Label 2"]}
          evaluatedDataAmount={42}
          isReport={false}
        >
          <BarChart filterSetData={barChartMuchData} orientation={"VERTICAL"} />
        </EvaluationDiagramBox>
        <EvaluationDiagramBox
          diagramId={"123"}
          evaluatedDataAmountTotal={100}
          title="ScatterDiagramm mit Werten die weit auseinander sind"
          description="Hier könnte Ihre Werbung stehen"
          filterLabels={["Label 1", "Label 2"]}
          evaluatedDataAmount={42}
          isReport={false}
        >
          <ScatterChart
            filterSet={scatterChartData}
            configuration={{
              trendline: true,
              axisRange: "ADAPTED",
              type: DiagramType.SCATTER_CHART,
              secondaryAttribute: undefined,
              xAttribute: {
                type: "IntegerAttribute",
              } as FlatAttribute,
              yAttribute: {
                type: "IntegerAttribute",
              } as FlatAttribute,
            }}
          />
        </EvaluationDiagramBox>
      </Stack>
    </MainContentLayout>
  );
}
