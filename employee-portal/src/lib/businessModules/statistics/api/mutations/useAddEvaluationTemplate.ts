/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { EvaluationTemplateFormModel } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/evaluationTemplateFormModel";

export function useAddEvaluationTemplate(onSuccess?: () => void) {
  const snackbar = useSnackbar();
  const evaluationTemplateApi = useEvaluationTemplateApi();

  const mutation = useHandledMutation({
    mutationFn: ({
      evaluationId,
      model,
    }: {
      evaluationId: string;
      model: EvaluationTemplateFormModel;
    }) =>
      evaluationTemplateApi.addEvaluationTemplate({
        type: "AddEvaluationTemplateFromEvaluationRequest",
        evaluationId: evaluationId,
        name: model.name,
        description:
          model.description.length === 0 ? undefined : model.description,
      }),
    onSuccess: () => {
      snackbar.confirmation("Vorlage erstellt");
      onSuccess?.();
    },
  });

  return async (evaluationId: string, model: EvaluationTemplateFormModel) => {
    return mutation.mutateAsync({ evaluationId, model });
  };
}
