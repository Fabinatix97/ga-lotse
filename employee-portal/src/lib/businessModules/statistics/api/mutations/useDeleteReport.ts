/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useReportApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteReport({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const snackbar = useSnackbar();
  const api = useReportApi();
  const mutation = useHandledMutation({
    mutationFn: (reportId: string) => api.deleteReport(reportId),
    onSuccess: () => snackbar.confirmation("Report wird gelöscht"),
  });

  return (reportId: string) => {
    return mutation.mutate(reportId, { onSuccess });
  };
}
