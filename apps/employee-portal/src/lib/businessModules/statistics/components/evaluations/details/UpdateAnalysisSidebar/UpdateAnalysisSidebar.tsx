/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish } from "remeda";

import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";

import {
  AnalysisDiagramConfiguration,
  DiagramType,
} from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { useUpdateAnalysis } from "@/lib/businessModules/statistics/api/mutations/useUpdateAnalysis";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";

import { UpdateBarChartStep } from "./UpdateBarChartStep";
import { UpdateChoroplethChartStep } from "./UpdateChoroplethChartStep";
import { UpdateHistogramChartStep } from "./UpdateHistogramChartStep";
import { UpdateLineChartStep } from "./UpdateLineChartStep";
import { UpdateAnalysisStep } from "./UpdateNameStep";
import { UpdateScatterChartStep } from "./UpdateScatterChartStep";
import { UpdateAnalysisFormModelStep } from "./updateAnalysisFormModel";

export function useUpdateAnalysisSidebar(): UseSidebarWithFormRefResult<UpdateAnalysisSidebarProps> {
  return useSidebarWithFormRef({
    component: UpdateAnalysisSidebar,
  });
}

interface UpdateAnalysisSidebarProps extends SidebarWithFormRefProps {
  analysisId: string;
  name: string;
  diagramConfiguration: AnalysisDiagramConfiguration;
}

function UpdateAnalysisSidebar(props: UpdateAnalysisSidebarProps) {
  const updateAnalysis = useUpdateAnalysis(props.analysisId, () =>
    props.onClose(true),
  );

  return (
    <SidebarStepper
      formRef={props.formRef}
      steps={[
        () => {
          switch (props.diagramConfiguration.type) {
            case DiagramType.CHOROPLETH_CHART:
              return {
                title: "Anpassung speichern",
                content: createStepContent({
                  component: UpdateChoroplethChartStep,
                }),
                initialValues: {
                  name: props.name,
                  type: DiagramType.CHOROPLETH_CHART,
                  colorScheme: props.diagramConfiguration.colorScheme,
                } satisfies UpdateAnalysisFormModelStep,
              };
            case DiagramType.BAR_CHART:
              return {
                title: "Anpassung speichern",
                content: createStepContent({
                  component: UpdateBarChartStep,
                  componentProps: {
                    showGroupedConfigurations: isNonNullish(
                      props.diagramConfiguration.secondaryAttribute,
                    ),
                  },
                }),
                initialValues: {
                  name: props.name,
                  type: DiagramType.BAR_CHART,
                  orientation: props.diagramConfiguration.orientation,
                  grouping: props.diagramConfiguration.grouping,
                  scaling: props.diagramConfiguration.scaling,
                } satisfies UpdateAnalysisFormModelStep,
              };
            case DiagramType.PIE_CHART:
              return {
                title: "Anpassung speichern",
                content: createStepContent({
                  component: UpdateAnalysisStep,
                }),
                initialValues: {
                  name: props.name,
                  type: DiagramType.PIE_CHART,
                } satisfies UpdateAnalysisFormModelStep,
              };
            case DiagramType.SCATTER_CHART:
              return {
                title: "Anpassung speichern",
                content: createStepContent({
                  component: UpdateScatterChartStep,
                }),
                initialValues: {
                  name: props.name,
                  type: DiagramType.SCATTER_CHART,
                  trendline: props.diagramConfiguration.trendline,
                  axisRange: props.diagramConfiguration.axisRange,
                } satisfies UpdateAnalysisFormModelStep,
              };
            case DiagramType.LINE_CHART:
              return {
                title: "Anpassung speichern",
                content: createStepContent({
                  component: UpdateLineChartStep,
                }),
                initialValues: {
                  name: props.name,
                  type: DiagramType.LINE_CHART,
                  axisRange: props.diagramConfiguration.axisRange,
                } satisfies UpdateAnalysisFormModelStep,
              };
            case DiagramType.HISTOGRAM_CHART:
              return {
                title: "Anpassung speichern",
                content: createStepContent({
                  component: UpdateHistogramChartStep,
                  componentProps: {
                    showGroupedConfigurations: isNonNullish(
                      props.diagramConfiguration.secondaryAttribute,
                    ),
                  },
                }),
                initialValues: {
                  name: props.name,
                  type: DiagramType.HISTOGRAM_CHART,
                  grouping: props.diagramConfiguration.grouping,
                  scaling: props.diagramConfiguration.scaling,
                } satisfies UpdateAnalysisFormModelStep,
              };
          }
        },
      ]}
      onClose={props.onClose}
      onSubmit={updateAnalysis}
    />
  );
}
