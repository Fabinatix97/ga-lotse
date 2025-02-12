/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { useAddAnalysis } from "@/lib/businessModules/statistics/api/mutations/useAddAnalysis";
import { useAddDiagram } from "@/lib/businessModules/statistics/api/mutations/useAddDiagram";
import { ConfigureBarChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureBarChartStep/ConfigureBarChartStep";
import { validateConfigureBarChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureBarChartStep/validateConfigureBarChartStep";
import { ConfigureChoroplethChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureChoroplethChartStep/ConfigureChoroplethChartStep";
import { ConfigureHistogramChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureHistogramChartStep/ConfigureHistogramChartStep";
import { validateConfigureHistogramChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureHistogramChartStep/validateConfigureHistogramChartStep";
import { ConfigureLineChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureLineChartStep/ConfigureLineChartStep";
import { ConfigurePieChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigurePieChartStep/ConfigurePieChartStep";
import { ConfigureScatterChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureScatterChartStep/ConfigureScatterChartStep";
import { SaveAnalysisStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/SaveAnalysisStep";
import { SelectDiagramStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SelectDiagramStep/SelectDiagramStep";
import {
  ConfigureChartFormModel,
  CreateAnalysisFormModel,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import {
  SidebarStepper,
  createStepContent,
} from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useCreateAnalysisSidebar(): UseSidebarWithFormRefResult<CreateAnalysisSidebarProps> {
  return useSidebarWithFormRef({
    component: CreateAnalysisSidebar,
  });
}

interface CreateAnalysisSidebarProps extends SidebarWithFormRefProps {
  evaluationId: string;
  attributes: FlatAttribute[];
  choroplethMaps: GeoShapeInfo[];
}

function CreateAnalysisSidebar({
  onClose,
  evaluationId,
  attributes,
  choroplethMaps,
  formRef,
}: CreateAnalysisSidebarProps) {
  const addAnalysis = useAddAnalysis(evaluationId, () => onClose(true));
  const addDiagram = useAddDiagram();

  const initialChartConfigurationValues: ConfigureChartFormModel = {
    primaryAttribute: null,
    secondaryAttribute: null,
    xAxis: null,
    yAxis: null,
    geoReferencedAttribute: null,
    geoShapeId: null,
    scaling: "ABSOLUTE",
    orientation: "VERTICAL",
    grouping: "GROUPED",
    axisRange: "ADAPTED",
    trendline: false,
    binning: "AUTO",
    bins: 8,
    minBin: "",
    maxBin: "",
    colorScheme: "UNIFORM",
    characteristicParameter: "MEAN",
  };

  async function createAnalysisAndDiagramWithoutFilters(
    model: CreateAnalysisFormModel,
  ) {
    await addAnalysis(model).then(
      async (analysisId) =>
        await addDiagram(
          {
            analysisId: analysisId,
            title: "Alle Daten",
            description: "",
            filterValues: [],
            attributes: [],
          },
          {},
        ),
    );
  }

  return (
    <SidebarStepper
      onClose={onClose}
      formRef={formRef}
      onSubmit={createAnalysisAndDiagramWithoutFilters}
      steps={[
        () => ({
          title: "Darstellung wählen",
          content: createStepContent({
            component: SelectDiagramStep,
          }),
          initialValues: { diagramType: DiagramType.BAR_CHART },
        }),
        (prevStepsValues) => {
          switch (prevStepsValues[0].diagramType) {
            case DiagramType.CHOROPLETH_CHART:
              return {
                title: "Choroplethenkarte konfigurieren",
                content: createStepContent({
                  component: ConfigureChoroplethChartStep,
                  componentProps: { attributes, choroplethMaps },
                }),
                initialValues: initialChartConfigurationValues,
              };
            case DiagramType.BAR_CHART:
              return {
                title: "Balkendiagramm konfigurieren",
                content: createStepContent({
                  component: ConfigureBarChartStep,
                  componentProps: { attributes },
                }),
                initialValues: initialChartConfigurationValues,
                validator: validateConfigureBarChartStep,
              };
            case DiagramType.PIE_CHART:
              return {
                title: "Kreisdiagramm konfigurieren",
                content: createStepContent({
                  component: ConfigurePieChartStep,
                  componentProps: { attributes },
                }),
                initialValues: initialChartConfigurationValues,
              };
            case DiagramType.SCATTER_CHART:
              return {
                title: "Streudiagramm konfigurieren",
                content: createStepContent({
                  component: ConfigureScatterChartStep,
                  componentProps: { attributes },
                }),
                initialValues: initialChartConfigurationValues,
              };
            case DiagramType.LINE_CHART:
              return {
                title: "Liniendiagramm konfigurieren",
                content: createStepContent({
                  component: ConfigureLineChartStep,
                  componentProps: { attributes },
                }),
                initialValues: initialChartConfigurationValues,
              };
            case DiagramType.HISTOGRAM_CHART:
              return {
                title: "Histogramm konfigurieren",
                content: createStepContent({
                  component: ConfigureHistogramChartStep,
                  componentProps: { attributes },
                }),
                initialValues: initialChartConfigurationValues,
                validator: validateConfigureHistogramChartStep,
              };
          }
        },
        () => ({
          title: "Analyse speichern",
          content: createStepContent({
            component: SaveAnalysisStep,
          }),
          initialValues: { name: "" },
        }),
      ]}
    />
  );
}
