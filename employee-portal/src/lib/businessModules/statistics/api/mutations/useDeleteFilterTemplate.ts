/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
