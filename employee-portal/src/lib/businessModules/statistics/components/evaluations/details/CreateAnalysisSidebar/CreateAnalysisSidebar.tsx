/**
 * Copyright 2024 cronn GmbH
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
import { ConfigureLineChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureLineChartStep/ConfigureLineChartStep";
import { ConfigurePieChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigurePieChartStep/ConfigurePieChartStep";
import { ConfigureScatterChartStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/ConfigureScatterChartStep/ConfigureScatterChartStep";
import { SaveAnalysisStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SaveAnalysisStep/SaveAnalysisStep";
import { SelectDiagramStep } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/SelectDiagramStep/SelectDiagramStep";
import { CreateAnalysisFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";
import { SidebarStepper } from "@/lib/shared/components/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/shared/components/SidebarStepper/sidebarStep";
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
  const initialValues: CreateAnalysisFormModel = {
    diagramType: DiagramType.BAR_CHART,
    name: "",
    configureBarChartFormModel: {
      scaling: "ABSOLUTE",
      orientation: "VERTICAL",
      grouping: "GROUPED",
      primaryAttributeSelectionKey: null,
      secondaryAttributeSelectionKey: null,
    },
    configurePieChartFormModel: {
      primaryAttribute: null,
    },
    configureScatterChartFormModel: {
      xAxis: null,
      yAxis: null,
      secondaryAttribute: null,
      axisRange: "ADAPTED",
      trendline: false,
    },
    configureLineChartFormModel: {
      xAxis: null,
      yAxis: null,
      secondaryAttribute: null,
      axisRange: "ADAPTED",
    },
    configureHistogramChartFormModel: {
      scaling: "ABSOLUTE",
      grouping: "GROUPED",
      binning: "AUTO",
      primaryAttribute: null,
      secondaryAttribute: null,
      bins: 8,
    },
    configureChoroplethChartFormModel: {
      geoShapeId: null,
      colorScheme: "UNIFORM",
      characteristicParameter: "MEAN",
      geoReferencedAttributeKey: null,
      secondaryAttributeSelectionKey: null,
    },
  };

  const addAnalysis = useAddAnalysis(evaluationId, () => onClose(true));
  const addDiagram = useAddDiagram();

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
      onSubmit={createAnalysisAndDiagramWithoutFilters}
      initialValues={initialValues}
      formRef={formRef}
      steps={
        [
          {
            type: "StandardStep",
            step: {
              title: "Darstellung wählen",
              content: <SelectDiagramStep />,
            },
          },
          {
            type: "BranchingStep",
            branch: (model) => {
              switch (model.diagramType) {
                case DiagramType.CHOROPLETH_CHART:
                  return {
                    title: "Choroplethenkarte konfigurieren",
                    content: (
                      <ConfigureChoroplethChartStep
                        attributes={attributes}
                        choroplethMaps={choroplethMaps}
                      />
                    ),
                  };
                case DiagramType.BAR_CHART:
                  return {
                    title: "Balkendiagramm konfigurieren",
                    content: <ConfigureBarChartStep attributes={attributes} />,
                    validator: validateConfigureBarChartStep,
                  };
                case DiagramType.PIE_CHART:
                  return {
                    title: "Kreisdiagramm konfigurieren",
                    content: <ConfigurePieChartStep attributes={attributes} />,
                  };
                case DiagramType.SCATTER_CHART:
                  return {
                    title: "Streudiagramm konfigurieren",
                    content: (
                      <ConfigureScatterChartStep attributes={attributes} />
                    ),
                  };
                case DiagramType.LINE_CHART:
                  return {
                    title: "Liniendiagramm konfigurieren",
                    content: <ConfigureLineChartStep attributes={attributes} />,
                  };
                case DiagramType.HISTOGRAM_CHART:
                  return {
                    title: "Histogramm konfigurieren",
                    content: (
                      <ConfigureHistogramChartStep attributes={attributes} />
                    ),
                  };
              }
            },
          },
          {
            type: "StandardStep",
            step: {
              title: "Analyse speichern",
              content: <SaveAnalysisStep />,
            },
          },
        ] satisfies SidebarStep<CreateAnalysisFormModel>[]
      }
    />
  );
}
