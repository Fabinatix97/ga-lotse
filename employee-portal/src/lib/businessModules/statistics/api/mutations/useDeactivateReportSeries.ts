/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useReportSeriesApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeactivateReportSeries() {
  const snackbar = useSnackbar();
  const api = useReportSeriesApi();
  const mutation = useHandledMutation({
    mutationFn: (seriesId: string) =>
      // Currently the openAPI generator doesn't map type to @type. This seems to be a bug. The current solution is a quick fix. One potential workaround would be to use an extra endpoint.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      api.updateReportSeries(seriesId, {
        type: "DeactivateAutoReportSeriesRequest",
        "@type": "DeactivateAutoReportSeriesRequest",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any),
    onSuccess: () => {
      snackbar.confirmation("Automatisierung deaktiviert");
    },
  });

  return (seriesId: string) => {
    return mutation.mutate(seriesId);
  };
}
