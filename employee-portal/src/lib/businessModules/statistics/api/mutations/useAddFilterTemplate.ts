/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useFilterTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapFilterValuesToStatisticFilters } from "@/lib/businessModules/statistics/api/mapper/mapFilterValuesToStatisticFilters";
import { FlatAttribute } from "@/lib/businessModules/statistics/api/models/flatAttribute";
import { FilterValue } from "@/lib/shared/components/filterSettings/models/FilterValue";

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
        filters: mapFilterValuesToStatisticFilters(
          useAddFilterTemplate.filters,
          attributes,
        ),
      }),
    onSuccess: () => snackbar.confirmation("Vorlage gespeichert"),
  });
  return async (useAddFilterTemplate: UseAddFilterTemplate) => {
    return mutation.mutateAsync(useAddFilterTemplate).catch();
  };
}
