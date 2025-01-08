/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

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
