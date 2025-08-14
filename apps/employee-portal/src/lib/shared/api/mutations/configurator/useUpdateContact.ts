/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiEmployeePortalMarkdownName,
  ApiLanguage,
  UpdateContactMarkdownRequest,
} from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { UpdateMarkdownRequest } from "@/lib/configurator/components/shared/ConfiguratorDetails/MarkdownFiles";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

import { buildMultiLanguagePayload } from "./buildFilePayload";

export function useUpdateContactMarkdown() {
  const snackbar = useSnackbar();
  const configuratorApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: ({ de, en }: UpdateContactMarkdownRequest) => {
      return configuratorApi.updateContactMarkdown(de, en);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return async (data: UpdateMarkdownRequest) => {
    const updateRequest = await buildMultiLanguagePayload(
      data,
      (lang: ApiLanguage) =>
        configuratorApi.getEmployeeMarkdownFile(
          ApiEmployeePortalMarkdownName.Contact,
          lang,
        ),
      "kontakt_mitarbeiter.md",
      "text/markdown",
    );
    return mutation.mutateAsync(updateRequest);
  };
}
