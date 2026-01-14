/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useEvaluationTemplateApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteEvaluationTemplate() {
  const snackbar = useSnackbar();
  const evaluationTemplateApi = useEvaluationTemplateApi();
  const mutation = useHandledMutation({
    mutationFn: (templateId: string) =>
      evaluationTemplateApi.deleteEvaluationTemplate(templateId),
    onSuccess: () =>
      snackbar.confirmation("Vorlage wurde erfolgreich gelöscht"),
  });
  return (templateId: string) => mutation.mutate(templateId);
}
