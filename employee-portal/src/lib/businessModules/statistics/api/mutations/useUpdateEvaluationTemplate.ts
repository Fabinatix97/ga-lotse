/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { EvaluationTemplateFormModel } from "@/lib/businessModules/statistics/components/evaluations/EvaluationTemplateSidebar/evaluationTemplateFormModel";

export function useUpdateEvaluationTemplate(onSuccess?: () => void) {
  const snackbar = useSnackbar();
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const mutation = useHandledMutation({
    mutationFn: (props: {
      evaluationTemplateId: string;
      name: string;
      description: string;
    }) =>
      evaluationTemplateApi.updateEvaluationTemplate(
        props.evaluationTemplateId,
        {
          name: props.name,
          description:
            props.description.length === 0 ? undefined : props.description,
        },
      ),
    onSuccess: () => {
      snackbar.confirmation("Vorlage bearbeitet");
      onSuccess?.();
    },
  });

  return async (
    evaluationTemplateId: string,
    model: EvaluationTemplateFormModel,
  ) =>
    mutation.mutateAsync({
      evaluationTemplateId: evaluationTemplateId,
      name: model.name,
      description: model.description,
    });
}
