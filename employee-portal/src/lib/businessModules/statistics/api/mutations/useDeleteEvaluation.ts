/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteEvaluation() {
  const api = useEvaluationApi();
  const snackbar = useSnackbar();
  const mutation = useHandledMutation({
    mutationFn: (evaluationId: string) => api.deleteEvaluation(evaluationId),
    onSuccess: () => snackbar.confirmation("Analyse gelöscht"),
  });

  return (evaluationId: string) => {
    mutation.mutate(evaluationId);
  };
}
