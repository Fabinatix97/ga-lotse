/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useStatisticsSchemeApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteStatisticsScheme() {
  const snackbar = useSnackbar();
  const statisticsSchemeApi = useStatisticsSchemeApi();
  const mutation = useHandledMutation({
    mutationFn: (schemeId: string) =>
      statisticsSchemeApi.deleteStatisticsScheme(schemeId),
    onSuccess: () =>
      snackbar.confirmation("Vorlage wurde erfolgreich gelöscht"),
  });
  return (schemeId: string) => mutation.mutate(schemeId);
}
