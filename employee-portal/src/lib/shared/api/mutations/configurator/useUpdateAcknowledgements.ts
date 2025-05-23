/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { UpdateAcknowledgementsMarkdownRequest } from "@eshg/base-api";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useMarkdownConfigurationApi } from "@/lib/shared/api/clients";

export function useUpdateAcknowledgementsMarkdown() {
  const snackbar = useSnackbar();
  const configuratorApi = useMarkdownConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: ({ de, en }: UpdateAcknowledgementsMarkdownRequest) => {
      return configuratorApi.updateAcknowledgementsMarkdown(de, en);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (request: UpdateAcknowledgementsMarkdownRequest) => {
    return mutation.mutateAsync(request);
  };
}
