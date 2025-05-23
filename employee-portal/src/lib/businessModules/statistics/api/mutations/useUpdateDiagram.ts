/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  mapOptionalValue,
  useHandledMutation,
  useSnackbar,
} from "@eshg/lib-portal";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";
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
  const api = useAnalysisApi();
  const snackbar = useSnackbar();

  const mutation = useHandledMutation({
    mutationFn: (model: UpdateDiagramFormModel) =>
      api.updateDiagram(
        diagramId,
        mapSaveDiagramFormModelToUpdateDiagramApiModel(model[0]),
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
