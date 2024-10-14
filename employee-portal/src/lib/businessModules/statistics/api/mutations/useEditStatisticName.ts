/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";

export function useEditStatisticName(statisticId: string) {
  const snackbar = useSnackbar();
  const statisticApi = useStatisticApi();

  const mutation = useHandledMutation({
    mutationFn: (name: string) =>
      statisticApi.updateStatistic(statisticId, {
        type: "UpdateStatisticNameRequest",
        name,
      }),
    onSuccess: () => snackbar.confirmation("Name geändert"),
  });

  return async (name: string) => {
    return mutation.mutateAsync(name).catch();
  };
}
