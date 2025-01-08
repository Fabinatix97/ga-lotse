/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";

export function useEditEvaluationName(evaluationId: string) {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();

  const mutation = useHandledMutation({
    mutationFn: (name: string) =>
      evaluationApi.updateEvaluation(evaluationId, {
        type: "UpdateEvaluationNameRequest",
        name,
      }),
    onSuccess: () => snackbar.confirmation("Name geändert"),
  });

  return async (name: string) => {
    return mutation.mutateAsync(name);
  };
}
