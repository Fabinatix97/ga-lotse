/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";

export function useDeleteDiagram(diagramId: string) {
  const api = useAnalysisApi();
  const snackbar = useSnackbar();
  const mutation = useHandledMutation({
    mutationFn: () => api.deleteDiagram(diagramId),
    onSuccess: () => snackbar.confirmation("Diagramm gelöscht"),
  });

  return () => {
    mutation.mutate();
  };
}
