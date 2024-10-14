/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAddStatisticRequest } from "@eshg/employee-portal-api/statistics";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import { mapTimeRangeEndFrontendToApi } from "@/lib/businessModules/statistics/api/mapper/mapTimeRangeEnd";

export function useAddStatistic({ onSuccess }: { onSuccess: () => void }) {
  const snackbar = useSnackbar();
  const statisticApi = useStatisticApi();
  const mutation = useHandledMutation({
    mutationFn: (apiAddStatisticRequest: ApiAddStatisticRequest) =>
      statisticApi.addStatistic(mapAddStatistic(apiAddStatisticRequest)),
    onSuccess: () => snackbar.confirmation("Auswertung wird erstellt"),
  });
  return (apiAddStatisticRequest: ApiAddStatisticRequest) =>
    mutation.mutateAsync(apiAddStatisticRequest, { onSuccess }).catch();
}

function mapAddStatistic(apiAddStatisticRequest: ApiAddStatisticRequest) {
  return {
    ...apiAddStatisticRequest,
    timeRangeEnd: mapTimeRangeEndFrontendToApi(
      apiAddStatisticRequest.timeRangeEnd,
    ),
  };
}
