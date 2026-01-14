/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteAnalysis() {
  const api = useAnalysisApi();
  const snackbar = useSnackbar();
  const mutation = useHandledMutation({
    mutationFn: (analysisId: string) => api.deleteAnalysis(analysisId),
    onSuccess: () => snackbar.confirmation("Analyse gelöscht"),
  });

  return (analysisId: string) => {
    mutation.mutate(analysisId);
  };
}
