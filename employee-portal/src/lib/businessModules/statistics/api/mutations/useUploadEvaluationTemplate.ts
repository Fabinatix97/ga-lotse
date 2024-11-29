/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useCentralRepositoryApi } from "@/lib/businessModules/statistics/api/clients";
import { UploadTemplateFormModel } from "@/lib/businessModules/statistics/components/evaluations/templates/UploadTemplateSidebar/uploadTemplateFormModel";

export function useUploadEvaluationTemplate(onSuccess: () => void) {
  const snackbar = useSnackbar();
  const centralRepositoryApi = useCentralRepositoryApi();
  const mutation = useHandledMutation({
    mutationFn: (props: { templateId: string; contact: string }) =>
      centralRepositoryApi.uploadEvaluationTemplateToRepository({
        templateId: props.templateId,
        contact: props.contact,
      }),
    onSuccess: () => {
      snackbar.confirmation("Vorlage hochgeladen");
    },
  });

  return async (templateId: string, model: UploadTemplateFormModel) =>
    mutation.mutateAsync(
      {
        templateId,
        contact: model.contact,
      },
      {
        onSuccess,
      },
    );
}
