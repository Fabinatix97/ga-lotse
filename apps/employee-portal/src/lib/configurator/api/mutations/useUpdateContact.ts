/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeePortalMarkdownName } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { UpdateMarkdownRequest } from "@/lib/configurator/components/shared/ConfiguratorDetails/MarkdownFiles";
import { SupportedLanguage, mapToApiLanguage } from "@/lib/i18n/language";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

import { buildMultiLanguagePayload } from "./buildFilePayload";

export function useUpdateContactMarkdown() {
  const snackbar = useSnackbar();
  const configuratorApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: (files: Blob[]) => {
      return configuratorApi.updateContactMarkdown(files);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return async (data: UpdateMarkdownRequest) => {
    const updateRequest = await buildMultiLanguagePayload(
      data,
      (lang: SupportedLanguage) =>
        configuratorApi.getEmployeeMarkdownFile(
          ApiEmployeePortalMarkdownName.Contact,
          mapToApiLanguage(lang),
        ),
      "md",
    );
    return mutation.mutateAsync(updateRequest);
  };
}
