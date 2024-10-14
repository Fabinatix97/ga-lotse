/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteStatistic() {
  const snackbar = useSnackbar();
  const statisticApi = useStatisticApi();
  const mutation = useHandledMutation({
    mutationFn: (statisticId: string) =>
      statisticApi.deleteStatistic(statisticId),
    onSuccess: () => {
      snackbar.confirmation("Auswertung gelöscht");
    },
  });
  return (statisticId: string) => mutation.mutate(statisticId);
}
