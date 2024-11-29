/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";
import { mapFilterValuesToEvaluationFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToEvaluationFilters";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { mapSaveDiagramFormModelToUpdateDiagramApiModel } from "@/lib/businessModules/statistics/api/mutations/useUpdateDiagram";
import { CreateDiagramFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/createDiagramFormModel";

export interface UseAddDiagramParams extends CreateDiagramFormModel {
  analysisId: string;
  attributes: FlatAttribute[];
}

export function useAddDiagram() {
  const snackbar = useSnackbar();
  const analysisApi = useAnalysisApi();

  const addDiagramMutation = useHandledMutation({
    mutationFn: (params: UseAddDiagramParams) =>
      analysisApi.addDiagram(params.analysisId, {
        ...mapSaveDiagramFormModelToUpdateDiagramApiModel(params),
        filters: mapFilterValuesToEvaluationFilters(
          params.filterValues,
          params.attributes,
        ),
      }),
    onSuccess: () => snackbar.confirmation("Diagramm hinzugefügt"),
  });

  return async (
    param: UseAddDiagramParams,
    options: { onSuccess?: () => void },
  ) => {
    await addDiagramMutation.mutateAsync(param, {
      onSuccess: options.onSuccess,
    });
  };
}
