/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiGetFilterTemplatesForStatisticResponse,
  FilterTemplateApi,
} from "@eshg/employee-portal-api/statistics";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useFilterTemplateApi } from "@/lib/businessModules/statistics/api/clients";
import { filterTemplateApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";
import { FilterTemplate } from "@/lib/shared/components/filterSettings/FilterTemplates";

export function createQueryGetFilterTemplates(
  api: FilterTemplateApi,
  statisticId: string,
) {
  return {
    queryKey: filterTemplateApiQueryKey([
      api.findFilterTemplatesForStatistic.name,
      statisticId,
    ]),
    queryFn: () => api.findFilterTemplatesForStatistic(statisticId),
    select: (result: ApiGetFilterTemplatesForStatisticResponse) =>
      result.filterTemplateIdAndNames.map(
        (it) =>
          ({
            id: it.id,
            name: it.name,
          }) satisfies FilterTemplate,
      ),
  };
}

export function useGetFilterTemplates(statisticId: string) {
  const api = useFilterTemplateApi();
  const query = useSuspenseQuery(
    createQueryGetFilterTemplates(api, statisticId),
  );
  return query.data;
}
