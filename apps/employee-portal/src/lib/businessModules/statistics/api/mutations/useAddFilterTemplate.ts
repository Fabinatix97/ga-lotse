/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FilterValue } from "@eshg/lib-employee-portal";
import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";

import { useFilterTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapFilterValuesToEvaluationFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToEvaluationFilters";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";

export interface UseAddFilterTemplate {
  name: string;
  filters: FilterValue[];
}

export function useAddFilterTemplate(attributes: FlatAttribute[]) {
  const snackbar = useSnackbar();
  const api = useFilterTemplateApi();
  const mutation = useHandledMutation({
    mutationFn: (useAddFilterTemplate: UseAddFilterTemplate) =>
      api.addFilterTemplate({
        name: useAddFilterTemplate.name,
        filters: mapFilterValuesToEvaluationFilters(
          useAddFilterTemplate.filters,
          attributes,
        ),
      }),
    onSuccess: () => snackbar.confirmation("Vorlage gespeichert"),
  });
  return async (useAddFilterTemplate: UseAddFilterTemplate) => {
    return mutation.mutateAsync(useAddFilterTemplate);
  };
}
