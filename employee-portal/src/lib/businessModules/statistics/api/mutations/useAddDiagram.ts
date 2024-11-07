/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { mapFilterValuesToStatisticFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToStatisticFilters";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { mapSaveDiagramFormModelToUpdateDiagramApiModel } from "@/lib/businessModules/statistics/api/mutations/useUpdateDiagram";
import { CreateDiagramFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/createDiagramFormModel";

export interface UseAddDiagramParams extends CreateDiagramFormModel {
  evaluationId: string;
  attributes: FlatAttribute[];
}

export function useAddDiagram() {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();

  const addDiagramMutation = useHandledMutation({
    mutationFn: (params: UseAddDiagramParams) =>
      evaluationApi.addDiagram(params.evaluationId, {
        ...mapSaveDiagramFormModelToUpdateDiagramApiModel(params),
        filters: mapFilterValuesToStatisticFilters(
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
