/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useEvaluationApi } from "@/lib/businessModules/statistics/api/clients";
import { evaluationApiQueryKey } from "@/lib/businessModules/statistics/api/queries/apiQueryKeys";

export function useGetCompletenessInformation(evaluationId: string) {
  const evaluationApi = useEvaluationApi();
  const queryResult = useSuspenseQuery({
    queryKey: evaluationApiQueryKey([
      "getCompletenessInformation",
      evaluationId,
    ]),
    queryFn: () => evaluationApi.getCompletenessInformation(evaluationId),
  });
  return queryResult.data;
}
