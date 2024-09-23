/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useStatisticApi } from "@/lib/businessModules/statistics/api/clients";
import { statisticApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

export function useGetCompletenessInformation(statisticId: string) {
  const statisticApi = useStatisticApi();
  const queryResult = useSuspenseQuery({
    queryKey: statisticApiQueryKey(["getCompletenessInformation", statisticId]),
    queryFn: () => statisticApi.getCompletenessInformation(statisticId),
  });
  return queryResult.data;
}
