/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAddEvaluationRequest,
  ApiAddEvaluationRequestChartConfiguration,
} from "@eshg/employee-portal-api/statistics";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { isNonNullish } from "remeda";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { mapKeyToAttributeSelection } from "@/lib/businessModules/statistics/api/mapper/mapAttributeSelectionKey";
import { DiagramType } from "@/lib/businessModules/statistics/api/models/statisticDetailsViewTypes";
import { CreateEvaluationFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateEvaluationSidebar/createEvaluationFormModel";

function mapSelectionKeyToBoolean(selectionKey: string | null) {
  if (isNonNullish(selectionKey) && selectionKey !== "") {
    return true;
  }
  return false;
}

export function mapModelToChartConfiguration(
  model: CreateEvaluationFormModel,
): ApiAddEvaluationRequestChartConfiguration {
  switch (model.diagramType) {
    case DiagramType.BAR_CHART: {
      const hasSecondaryAttribute = mapSelectionKeyToBoolean(
        model.configureBarChartFormModel.secondaryAttributeSelectionKey,
      );
      return {
        type: "BarChartConfiguration",
        orientation: model.configureBarChartFormModel.orientation,
        grouping: hasSecondaryAttribute
          ? model.configureBarChartFormModel.grouping
          : undefined,
        scaling: hasSecondaryAttribute
          ? model.configureBarChartFormModel.scaling
          : undefined,
        primaryAttribute: mapKeyToAttributeSelection(
          model.configureBarChartFormModel.primaryAttributeSelectionKey!,
        ),
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              model.configureBarChartFormModel.secondaryAttributeSelectionKey!,
            )
          : undefined,
      };
    }
    case DiagramType.PIE_CHART:
      return {
        type: "PieChartConfiguration",
        attribute: mapKeyToAttributeSelection(
          model.configurePieChartFormModel.primaryAttribute!,
        ),
      };
    case DiagramType.HISTOGRAM_CHART: {
      const hasSecondaryAttribute = mapSelectionKeyToBoolean(
        model.configureHistogramChartFormModel.secondaryAttribute,
      );
      return {
        type: "HistogramChartConfiguration",
        primaryAttribute: mapKeyToAttributeSelection(
          model.configureHistogramChartFormModel.primaryAttribute!,
        ),
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              model.configureHistogramChartFormModel.secondaryAttribute!,
            )
          : undefined,
        scaling: hasSecondaryAttribute
          ? model.configureHistogramChartFormModel.scaling
          : undefined,
        grouping: hasSecondaryAttribute
          ? model.configureHistogramChartFormModel.grouping
          : undefined,
        binningMode: model.configureHistogramChartFormModel.binning,
        numberOfBins:
          model.configureHistogramChartFormModel.binning === "MANUAL"
            ? model.configureHistogramChartFormModel.bins
            : undefined,
      };
    }
    case DiagramType.CHOROPLETH_CHART: {
      const hasSecondaryAttribute = mapSelectionKeyToBoolean(
        model.configureChoroplethChartFormModel.secondaryAttributeSelectionKey,
      );
      return {
        type: "AddChoroplethMapConfiguration",
        geoShapeId: model.configureChoroplethChartFormModel.geoShapeId!,
        calculation: hasSecondaryAttribute
          ? model.configureChoroplethChartFormModel.characteristicParameter
          : undefined,
        colorScheme: model.configureChoroplethChartFormModel.colorScheme,
        primaryAttribute: mapKeyToAttributeSelection(
          model.configureChoroplethChartFormModel.geoReferencedAttributeKey!,
        ),
        secondaryAttribute: model.configureChoroplethChartFormModel
          .secondaryAttributeSelectionKey
          ? mapKeyToAttributeSelection(
              model.configureChoroplethChartFormModel
                .secondaryAttributeSelectionKey,
            )
          : undefined,
      };
    }
    case DiagramType.SCATTER_CHART: {
      const hasSecondaryAttribute =
        model.configureScatterChartFormModel.secondaryAttribute;
      return {
        type: "ScatterChartConfiguration",
        range: model.configureScatterChartFormModel.axisRange,
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              model.configureScatterChartFormModel.secondaryAttribute!,
            )
          : undefined,
        trendLine: model.configureScatterChartFormModel.trendline,
        xAttribute: mapKeyToAttributeSelection(
          model.configureScatterChartFormModel.xAxis!,
        ),
        yAttribute: mapKeyToAttributeSelection(
          model.configureScatterChartFormModel.yAxis!,
        ),
      };
    }
    case DiagramType.LINE_CHART: {
      const hasSecondaryAttribute =
        model.configureLineChartFormModel.secondaryAttribute;
      return {
        type: "LineChartConfiguration",
        range: model.configureLineChartFormModel.axisRange,
        secondaryAttribute: hasSecondaryAttribute
          ? mapKeyToAttributeSelection(
              model.configureLineChartFormModel.secondaryAttribute!,
            )
          : undefined,
        xAttribute: mapKeyToAttributeSelection(
          model.configureLineChartFormModel.xAxis!,
        ),
        yAttribute: mapKeyToAttributeSelection(
          model.configureLineChartFormModel.yAxis!,
        ),
      };
    }
  }
}

export function useAddEvaluation(statisticId: string, onClose: () => void) {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();

  const mutation = useHandledMutation({
    mutationFn: (apiAddEvaluationRequest: ApiAddEvaluationRequest) =>
      evaluationApi.addEvaluation(apiAddEvaluationRequest),
    onSuccess: () => snackbar.confirmation("Analyse erstellt"),
  });

  return async (model: CreateEvaluationFormModel) => {
    return await mutation
      .mutateAsync(
        {
          statisticId: statisticId,
          name: model.name.trim(),
          chartConfiguration: mapModelToChartConfiguration(model),
        },
        {
          onSuccess: onClose,
        },
      )
      // TODO: ISSUE-6052: don't use response data. Combine multiple API calls into a single one.
      .then((it) => it.id);
  };
}
