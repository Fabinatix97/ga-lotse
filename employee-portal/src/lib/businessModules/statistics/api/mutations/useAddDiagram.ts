/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterValue } from "@eshg/lib-employee-portal";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useAnalysisApi } from "@/lib/businessModules/statistics/api/clients";
import { mapFilterValuesToEvaluationFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToEvaluationFilters";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { mapSaveDiagramFormModelToUpdateDiagramApiModel } from "@/lib/businessModules/statistics/api/mutations/useUpdateDiagram";

interface UseAddDiagramParams {
  analysisId: string;
  attributes: FlatAttribute[];
  filterValues: FilterValue[];
  title: string;
  description: string;
}

export function useAddDiagram() {
  const snackbar = useSnackbar();
  const analysisApi = useAnalysisApi();

  const addDiagramMutation = useHandledMutation({
    mutationFn: (params: UseAddDiagramParams) =>
      analysisApi.addDiagram(params.analysisId, {
        ...mapSaveDiagramFormModelToUpdateDiagramApiModel(params),
        filters: mapFilterValuesToEvaluationFilters(
          params.filterValues,
          params.attributes,
        ),
      }),
    onSuccess: () => snackbar.confirmation("Diagramm hinzugefügt"),
  });

  return async (
    param: UseAddDiagramParams,
    options: { onSuccess?: () => void; onError?: () => void },
  ) => {
    await addDiagramMutation
      .mutateAsync(param, {
        onSuccess: options.onSuccess,
      })
      .catch(options.onError);
  };
}
