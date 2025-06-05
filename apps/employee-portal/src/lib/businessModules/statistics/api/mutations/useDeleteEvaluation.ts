/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteEvaluation() {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();
  const mutation = useHandledMutation({
    mutationFn: (evaluationId: string) =>
      evaluationApi.deleteEvaluation(evaluationId),
    onSuccess: () => {
      snackbar.confirmation("Auswertung gelöscht");
    },
  });
  return (evaluationId: string) => mutation.mutate(evaluationId);
}
