/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCloneStatisticRequest } from "@eshg/employee-portal-api/statistics";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";

export function useDuplicateStatistic({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const snackbar = useSnackbar();
  const statisticApi = useStatisticApi();
  const mutation = useHandledMutation({
    mutationFn: (params: ApiCloneStatisticRequest) =>
      statisticApi.cloneStatistic(params),
    onSuccess: () => {
      onSuccess();
      snackbar.confirmation("Auswertung wird dupliziert");
    },
  });
  return (params: ApiCloneStatisticRequest) =>
    mutation.mutateAsync(params, { onSuccess }).catch();
}
