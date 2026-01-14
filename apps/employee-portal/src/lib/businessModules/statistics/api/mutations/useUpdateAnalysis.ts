/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiUpdateAnalysisRequestUpdateChartConfigurationDto } from "@eshg/statistics-api";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";
import { DiagramType } from "@/lib/businessModules/statistics/api/models/evaluationDetailsViewTypes";
import {
  UpdateAnalysisFormModel,
  UpdateAnalysisFormModelStep,
} from "@/lib/businessModules/statistics/components/evaluations/details/UpdateAnalysisSidebar/updateAnalysisFormModel";

export function useUpdateAnalysis(
  analysisId: string,
  onSuccess: () => void,
): (model: UpdateAnalysisFormModel) => Promise<void> {
  const api = useAnalysisApi();
  const snackbar = useSnackbar();

  const mutation = useHandledMutation({
    mutationFn: (model: UpdateAnalysisFormModel) =>
      api.updateAnalysis(analysisId, {
        name: model[0].name.trim(),
        updateChartConfigurationDto: mapUpdateChartConfigurationDto(model[0]),
      }),
    onSuccess: () => {
      onSuccess();
      snackbar.confirmation("Analyse angepasst");
    },
  });

  return async (model: UpdateAnalysisFormModel) => {
    await mutation.mutateAsync(model);
  };
}

type UpdateAnalysisRequest =
  ApiUpdateAnalysisRequestUpdateChartConfigurationDto;

function mapUpdateChartConfigurationDto(
  model: UpdateAnalysisFormModelStep,
): UpdateAnalysisRequest | undefined {
  switch (model.type) {
    case DiagramType.BAR_CHART:
      return {
        type: "UpdateBarChartConfiguration",
        grouping: model.grouping,
        orientation: model.orientation,
        scaling: model.scaling,
      };
    case DiagramType.CHOROPLETH_CHART:
      return {
        type: "UpdateChoroplethMapConfiguration",
        colorScheme: model.colorScheme,
      };
    case DiagramType.HISTOGRAM_CHART:
      return {
        type: "UpdateHistogramChartConfiguration",
        grouping: model.grouping,
        scaling: model.scaling,
      };
    case DiagramType.LINE_CHART:
      return {
        type: "UpdateLineChartConfiguration",
        rangeDto: model.axisRange,
      };
    case DiagramType.SCATTER_CHART:
      return {
        type: "UpdateScatterChartConfiguration",
        rangeDto: model.axisRange,
        trendLine: model.trendline,
      };
    case DiagramType.PIE_CHART:
      return undefined;
  }
}
