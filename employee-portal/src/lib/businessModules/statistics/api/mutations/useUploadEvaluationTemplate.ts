/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useRouter } from "next/navigation";

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useCentralRepositoryApi } from "@/lib/businessModules/statistics/api/clients";
import { UploadTemplateFormModel } from "@/lib/businessModules/statistics/components/evaluations/templates/UploadTemplateSidebar/uploadTemplateFormModel";
import { routes } from "@/lib/businessModules/statistics/shared/routes";

export function useUploadEvaluationTemplate(onSuccess: () => void) {
  const snackbar = useSnackbar();
  const router = useRouter();
  const centralRepositoryApi = useCentralRepositoryApi();
  const mutation = useHandledMutation({
    mutationFn: (props: {
      templateId: string;
      model: UploadTemplateFormModel;
    }) =>
      centralRepositoryApi.uploadEvaluationTemplateToRepository({
        templateId: props.templateId,
        name: props.model.name,
        description:
          props.model.description.length === 0
            ? undefined
            : props.model.description,
        contact: props.model.contact,
      }),
    onSuccess: () => {
      snackbar.confirmation("Vorlage hochgeladen", {
        action: {
          name: "Anzeigen",
          onClick: () => router.push(routes.evaluations.templates.repository),
        },
      });
    },
  });

  return async (templateId: string, model: UploadTemplateFormModel) =>
    mutation.mutateAsync(
      {
        templateId,
        model,
      },
      {
        onSuccess,
      },
    );
}
