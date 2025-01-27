/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiAddEvaluationRequest } from "@eshg/statistics-api";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndFrontendToApi } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";

export function useAddEvaluation({ onSuccess }: { onSuccess: () => void }) {
  const snackbar = useSnackbar();
  const evaluationApi = useEvaluationApi();
  const mutation = useHandledMutation({
    mutationFn: (apiAddEvaluationRequest: ApiAddEvaluationRequest) =>
      evaluationApi.addEvaluation(mapAddEvaluation(apiAddEvaluationRequest)),
    onSuccess: () => snackbar.confirmation("Auswertung wird erstellt"),
  });
  return (apiAddEvaluationRequest: ApiAddEvaluationRequest) =>
    mutation.mutateAsync(apiAddEvaluationRequest, { onSuccess });
}

function mapAddEvaluation(apiAddEvaluationRequest: ApiAddEvaluationRequest) {
  return {
    ...apiAddEvaluationRequest,
    timeRangeEnd: mapTimeRangeEndFrontendToApi(
      apiAddEvaluationRequest.timeRangeEnd,
    ),
  };
}
