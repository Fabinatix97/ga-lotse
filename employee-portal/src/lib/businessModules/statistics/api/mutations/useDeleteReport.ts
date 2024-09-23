/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteReport() {
  const snackbar = useSnackbar();
  const api = useReportSeriesApi();
  const mutation = useHandledMutation({
    mutationFn: (seriesId: string) => api.deleteReportSeries(seriesId),
    onSuccess: () => snackbar.confirmation("Report gelöscht"),
  });

  return (reportId: string) => {
    return mutation.mutate(reportId);
  };
}
