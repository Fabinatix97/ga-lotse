/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCloneEvaluationRequest } from "@eshg/employee-portal-api/statistics";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
