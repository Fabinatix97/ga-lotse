/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";
import { UpdateAnalysisFormModel } from "@/lib/businessModules/statistics/components/evaluations/details/UpdateAnalysisSidebar/updateAnalysisFormModel";

export function useUpdateAnalysis(
  analysisId: string,
  onSuccess: () => void,
): (model: UpdateAnalysisFormModel) => Promise<void> {
  const api = useAnalysisApi();
  const snackbar = useSnackbar();

  const mutation = useHandledMutation({
    mutationFn: (model: UpdateAnalysisFormModel) =>
      api.updateAnalysis(analysisId, {
        name: model[0].name.trim(),
      }),
    onSuccess: () => {
      onSuccess();
      snackbar.confirmation("Analyse angepasst");
    },
  });

  return async (model: UpdateAnalysisFormModel) => {
    await mutation.mutateAsync(model);
  };
}
