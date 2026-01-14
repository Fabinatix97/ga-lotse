/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiCitizenPortalMarkdownName,
  ApiLanguage,
  UpdateImprintMarkdownRequest,
} from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { UpdateMarkdownRequest } from "@/lib/configurator/components/shared/ConfiguratorDetails/MarkdownFiles";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

import { buildMultiLanguagePayload } from "./buildFilePayload";

export function useUpdateImprintMarkdown() {
  const snackbar = useSnackbar();
  const configuratorApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: ({ de, en }: UpdateImprintMarkdownRequest) => {
      return configuratorApi.updateImprintMarkdown(de, en);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return async (data: UpdateMarkdownRequest) => {
    const updateRequest = await buildMultiLanguagePayload(
      data,
      (lang: ApiLanguage) =>
        configuratorApi.getCitizenMarkdownFile(
          ApiCitizenPortalMarkdownName.Imprint,
          lang,
        ),
      "impressum.md",
      "text/markdown",
    );
    return mutation.mutateAsync(updateRequest);
  };
}
