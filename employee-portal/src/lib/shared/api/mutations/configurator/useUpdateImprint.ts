/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { UpdateImprintMarkdownRequest } from "@eshg/base-api";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useMarkdownConfigurationApi } from "@/lib/shared/api/clients";

export function useUpdateImprintMarkdown() {
  const snackbar = useSnackbar();
  const configuratorApi = useMarkdownConfigurationApi();

  const mutation = useHandledMutation({
    mutationFn: ({ de, en }: UpdateImprintMarkdownRequest) => {
      return configuratorApi.updateImprintMarkdown(de, en);
    },
    onSuccess: () =>
      snackbar.confirmation("Die Änderungen wurden gespeichert."),
  });

  return (request: UpdateImprintMarkdownRequest) => {
    return mutation.mutateAsync(request);
  };
}
