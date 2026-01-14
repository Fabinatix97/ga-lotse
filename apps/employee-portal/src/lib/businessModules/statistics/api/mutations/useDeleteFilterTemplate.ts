/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useFilterTemplateApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteFilterTemplate() {
  const snackbar = useSnackbar();
  const api = useFilterTemplateApi();
  const mutation = useHandledMutation({
    mutationFn: (filterTemplateId: string) =>
      api.deleteFilterTemplate(filterTemplateId),
    onSuccess: () => snackbar.confirmation("Vorlage gelöscht"),
  });

  return (filterTemplateId: string) => {
    return mutation.mutate(filterTemplateId);
  };
}
