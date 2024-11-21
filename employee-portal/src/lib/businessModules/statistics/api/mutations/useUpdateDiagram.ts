/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { mapOptionalValue } from "@eshg/lib-portal/helpers/form";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { SaveDiagramStepFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/CreateDiagramSidebar/SaveDiagramStep/saveDiagramStepFormModel";
import { UpdateDiagramFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateDiagramSidebar/updateDiagramFormModel";

export function mapSaveDiagramFormModelToUpdateDiagramApiModel(
  model: SaveDiagramStepFormModel,
) {
  return {
    title: model.title.trim(),
    description: mapOptionalValue(model.description.trim()),
  };
}

export function useUpdateDiagram(
  diagramId: string,
  onSuccess: () => void,
): (model: UpdateDiagramFormModel) => Promise<void> {
  const api = useEvaluationApi();
  const snackbar = useSnackbar();

  const mutation = useHandledMutation({
    mutationFn: (model: UpdateDiagramFormModel) =>
      api.updateDiagram(
        diagramId,
        mapSaveDiagramFormModelToUpdateDiagramApiModel(model),
      ),
    onSuccess: () => {
      onSuccess();
      snackbar.confirmation("Diagramm angepasst");
    },
  });

  return async (model: UpdateDiagramFormModel) => {
    await mutation.mutateAsync(model);
  };
}
