/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeactivateReportSeries() {
  const snackbar = useSnackbar();
  const api = useReportSeriesApi();
  const mutation = useHandledMutation({
    mutationFn: (seriesId: string) => api.deactivateReportSeries(seriesId),
    onSuccess: () => {
      snackbar.confirmation("Automatisierung deaktiviert");
    },
  });

  return (seriesId: string) => {
    return mutation.mutate(seriesId);
  };
}
