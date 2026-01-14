/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiCitizenPortalMarkdownName,
  ApiLanguage,
  UpdateAcknowledgementsMarkdownRequest,
} from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { UpdateMarkdownRequest } from "@/lib/configurator/components/shared/ConfiguratorDetails/MarkdownFiles";
import { useDepartmentConfigurationApi } from "@/lib/shared/api/clients";

import { buildMultiLanguagePayload } from "./buildFilePayload";

export function useUpdateAcknowledgementsMarkdown() {
  const snackbar = useSnackbar();
  const configuratorApi = useDepartmentConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: ({ de, en }: UpdateAcknowledgementsMarkdownRequest) => {
      return configuratorApi.updateAcknowledgementsMarkdown(de, en);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return async (data: UpdateMarkdownRequest) => {
    const updateRequest = await buildMultiLanguagePayload(
      data,
      (lang: ApiLanguage) =>
        configuratorApi.getCitizenMarkdownFile(
          ApiCitizenPortalMarkdownName.Acknowledgements,
          lang,
        ),
      "danksagung.md",
      "text/markdown",
    );
    return mutation.mutateAsync(updateRequest);
  };
}
