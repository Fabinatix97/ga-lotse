/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish, isNumber } from "remeda";

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import {
  ApiAddAnalysisRequest,
  ApiAddAnalysisRequestChartConfiguration,
} from "@eshg/statistics-api";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";
import { mapKeyToAttributeSelection } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  ConfigureChartFormModel,
  CreateAnalysisFormModel,
} from "@/lib/businessModules/statistics/components/evaluations/details/CreateAnalysisSidebar/createAnalysisFormModel";

function mapSelectionKeyToBoolean(selectionKey: string | null) {
  if (isNonNullish(selectionKey) && selectionKey !== "") {
    return true;
  }
  return false;
}

export function mapModelToChartConfiguration({
  diagramType,
  chartConfigurationModel,
}: {
  diagramType: DiagramType;
  chartConfigurationModel: ConfigureChartFormModel;
}): ApiAddAnalysisRequestChartConfiguration {
  switch (diagramType) {
    case DiagramType.BAR_CHART: {
      const hasSecondaryAttribute = mapSelectionKeyToBoolean(
        chartConfigurationModel.secondaryAttribute,
      );
      return {
        type: "BarChartConfiguration",
        orientation: chartConfigurationModel.orientation,
        grouping: hasSecondaryAttribute
          ? chartConfigurationModel.grouping
          : undefined,
        scaling: hasSecondaryAttribute
          ? chartConfigurationModel.scaling
          : undefined,
        primaryAttribute: mapKeyToAttributeSelection(
          chartConfigurationModel.primaryAttribute!,
        ),
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              chartConfigurationModel.secondaryAttribute!,
            )
          : undefined,
      };
    }
    case DiagramType.PIE_CHART:
      return {
        type: "PieChartConfiguration",
        attribute: mapKeyToAttributeSelection(
          chartConfigurationModel.primaryAttribute!,
        ),
      };
    case DiagramType.HISTOGRAM_CHART: {
      const hasSecondaryAttribute = mapSelectionKeyToBoolean(
        chartConfigurationModel.secondaryAttribute,
      );
      const manualBinning = chartConfigurationModel.binning === "MANUAL";
      return {
        type: "HistogramChartConfiguration",
        primaryAttribute: mapKeyToAttributeSelection(
          chartConfigurationModel.primaryAttribute!,
        ),
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              chartConfigurationModel.secondaryAttribute!,
            )
          : undefined,
        scaling: hasSecondaryAttribute
          ? chartConfigurationModel.scaling
          : undefined,
        grouping: hasSecondaryAttribute
          ? chartConfigurationModel.grouping
          : undefined,
        binningMode: chartConfigurationModel.binning,
        numberOfBins: manualBinning ? chartConfigurationModel.bins : undefined,
        minBin:
          manualBinning && isNumber(chartConfigurationModel.minBin)
            ? chartConfigurationModel.minBin
            : undefined,
        maxBin:
          manualBinning && isNumber(chartConfigurationModel.maxBin)
            ? chartConfigurationModel.maxBin
            : undefined,
      };
    }
    case DiagramType.CHOROPLETH_CHART: {
      const hasSecondaryAttribute = mapSelectionKeyToBoolean(
        chartConfigurationModel.secondaryAttribute,
      );
      return {
        type: "AddChoroplethMapConfiguration",
        geoShapeId: chartConfigurationModel.geoShapeId!,
        calculation: hasSecondaryAttribute
          ? chartConfigurationModel.characteristicParameter
          : undefined,
        colorScheme: chartConfigurationModel.colorScheme,
        primaryAttribute: mapKeyToAttributeSelection(
          chartConfigurationModel.geoReferencedAttribute!,
        ),
        secondaryAttribute: chartConfigurationModel.secondaryAttribute
          ? mapKeyToAttributeSelection(
              chartConfigurationModel.secondaryAttribute,
            )
          : undefined,
      };
    }
    case DiagramType.SCATTER_CHART: {
      const hasSecondaryAttribute = chartConfigurationModel.secondaryAttribute;
      return {
        type: "ScatterChartConfiguration",
        range: chartConfigurationModel.axisRange,
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              chartConfigurationModel.secondaryAttribute!,
            )
          : undefined,
        trendLine: chartConfigurationModel.trendline,
        xAttribute: mapKeyToAttributeSelection(chartConfigurationModel.xAxis!),
        yAttribute: mapKeyToAttributeSelection(chartConfigurationModel.yAxis!),
      };
    }
    case DiagramType.LINE_CHART: {
      const hasSecondaryAttribute = chartConfigurationModel.secondaryAttribute;
      return {
        type: "LineChartConfiguration",
        range: chartConfigurationModel.axisRange,
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              chartConfigurationModel.secondaryAttribute!,
            )
          : undefined,
        xAttribute: mapKeyToAttributeSelection(chartConfigurationModel.xAxis!),
        yAttribute: mapKeyToAttributeSelection(chartConfigurationModel.yAxis!),
      };
    }
  }
}

export function useAddAnalysis(evaluationId: string, onClose: () => void) {
  const snackbar = useSnackbar();
  const analysisApi = useAnalysisApi();

  const mutation = useHandledMutation({
    mutationFn: (ApiAddAnalysisRequest: ApiAddAnalysisRequest) =>
      analysisApi.addAnalysis(ApiAddAnalysisRequest),
    onSuccess: () => snackbar.confirmation("Analyse erstellt"),
  });

  return async (model: CreateAnalysisFormModel) => {
    return await mutation
      .mutateAsync(
        {
          evaluationId: evaluationId,
          name: model[2].name.trim(),
          chartConfiguration: mapModelToChartConfiguration({
            diagramType: model[0].diagramType,
            chartConfigurationModel: model[1],
          }),
        },
        {
          onSuccess: onClose,
        },
      )
      // TODO: ISSUE-6052: don't use response data. Combine multiple API calls into a single one.
      .then((it) => it.id);
  };
}
