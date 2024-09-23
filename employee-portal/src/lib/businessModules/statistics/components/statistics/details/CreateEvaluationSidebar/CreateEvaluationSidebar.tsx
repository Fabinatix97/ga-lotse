/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { GeoShapeInfo } from "@/lib/businessModules/statistics/api/models/geoShapesTableView";
import { DiagramType } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { useAddDiagram } from "@/lib/businessModules/statistics/api/mutations/useAddDiagram";
import { useAddEvaluation } from "@/lib/businessModules/statistics/api/mutations/useAddEvaluation";
import { SidebarStepper } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/SidebarStepper";
import { SidebarStep } from "@/lib/businessModules/statistics/components/shared/SidebarStepper/sidebarStep";
import { ConfigureBarChartStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureBarChartStep/ConfigureBarChartStep";
import { ConfigureChoroplethChartStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureChoroplethChartStep/ConfigureChoroplethChartStep";
import { ConfigureHistogramChartStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureHistogramChartStep/ConfigureHistogramChartStep";
import { ConfigureLineChartStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureLineChartStep/ConfigureLineChartStep";
import { ConfigurePieChartStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigurePieChartStep/ConfigurePieChartStep";
import { ConfigureScatterChartStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/ConfigureScatterChartStep/ConfigureScatterChartStep";
import { SaveEvaluationStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/SaveEvaluationStep/SaveEvaluationStep";
import { SelectDiagramStep } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/SelectDiagramStep/SelectDiagramStep";
import { CreateEvaluationFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/createEvaluationFormModel";

export function CreateEvaluationSidebar({
  open,
  onClose,
  statisticId,
  attributes,
  choroplethMaps,
}: {
  open: boolean;
  onClose: () => void;
  statisticId: string;
  attributes: FlatAttribute[];
  choroplethMaps: GeoShapeInfo[];
}) {
  const initialValues: CreateEvaluationFormModel = {
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

  const createEvaluation = useAddEvaluation(statisticId, onClose);
  const createDiagram = useAddDiagram();

  async function createEvaluationAndDiagramWithoutFilters(
    model: CreateEvaluationFormModel,
  ) {
    await createEvaluation(model).then(
      async (evaluationId) =>
        await createDiagram(
          {
            evaluationId: evaluationId,
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
      open={open}
      onClose={onClose}
      onSubmit={createEvaluationAndDiagramWithoutFilters}
      initialValues={initialValues}
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
              title: "Auswertung speichern",
              content: <SaveEvaluationStep />,
            },
          },
        ] satisfies SidebarStep<CreateEvaluationFormModel>[]
      }
    />
  );
}
