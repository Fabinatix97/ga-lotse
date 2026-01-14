/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import { ApiCloneEvaluationRequest } from "@eshg/statistics-api";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";

export function useDuplicateEvaluation({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();
  const mutation = useHandledMutation({
    mutationFn: (params: ApiCloneEvaluationRequest) =>
      evaluationApi.cloneEvaluation(params),
    onSuccess: () => {
      onSuccess();
      snackbar.confirmation("Auswertung wird dupliziert");
    },
  });
  return (params: ApiCloneEvaluationRequest) =>
    mutation.mutateAsync(params, { onSuccess });
}
