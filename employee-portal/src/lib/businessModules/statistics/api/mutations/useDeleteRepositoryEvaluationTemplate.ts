/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useCentralRepositoryApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteRepositoryEvaluationTemplate() {
  const snackbar = useSnackbar();
  const centralRepositoryApi = useCentralRepositoryApi();
  const mutation = useHandledMutation({
    mutationFn: (props: { templateId: number; templateVersion: number }) =>
      centralRepositoryApi.deleteEvaluationTemplateFromRepository(
        props.templateId,
        props.templateVersion,
      ),
    onSuccess: () =>
      snackbar.confirmation("Vorlage wurde erfolgreich gelöscht"),
  });
  return (templateId: number, templateVersion: number) =>
    mutation.mutate({ templateId, templateVersion });
}
