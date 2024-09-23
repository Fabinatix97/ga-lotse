/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";

import { useFilterTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { mapStatisticFilterToFilterValue } from "@/lib/businessModules/statistics/api/mapper/mapStatisticFilterToFilterValue";

export function useGetFilterTemplateFilters() {
  const api = useFilterTemplateApi();
  const mutation = useHandledMutation({
    mutationFn: (filterTemplateId: string) =>
      api
        .getFilterTemplate(filterTemplateId)
        .then((result) => result.filters.map(mapStatisticFilterToFilterValue)),
  });

  return async (filterTemplateId: string) => {
    return mutation.mutateAsync(filterTemplateId).catch();
  };
}
