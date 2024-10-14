/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { UpdateEvaluationFormModel } from "@/lib/businessModules/statistics/components/statistics/details/UpdateEvaluationSidebar/updateEvaluationFormModel";

export interface UseUpdateEvaluationParams extends UpdateEvaluationFormModel {
  evaluationId: string;
}

export function useUpdateEvaluation(
  evaluationId: string,
  onSuccess: () => void,
): (model: UpdateEvaluationFormModel) => Promise<void> {
  const api = useEvaluationApi();
  const snackbar = useSnackbar();

  const mutation = useHandledMutation({
    mutationFn: (model: UpdateEvaluationFormModel) =>
      api.updateEvaluation(evaluationId, {
        name: model.name.trim(),
      }),
    onSuccess: () => {
      onSuccess();
      snackbar.confirmation("Analyse angepasst");
    },
  });

  return async (model: UpdateEvaluationFormModel) => {
    await mutation.mutateAsync(model).catch();
  };
}
