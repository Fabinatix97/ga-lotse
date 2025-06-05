/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { GetPercentilesRequest } from "@eshg/school-entry-api";

import { useValueEvaluatorApi } from "@/lib/businessModules/schoolEntry/api/clients";
import {
  Percentiles,
  mapPercentiles,
} from "@/lib/businessModules/schoolEntry/api/models/examinations/Percentiles";
import { valueEvaluatorApiQueryKey } from "@/lib/businessModules/schoolEntry/api/queries/apiQueryKeys";

interface GetPercentilesOptions {
  enabled: boolean;
  initialData?: Percentiles;
}

export function useGetPercentiles(
  request: GetPercentilesRequest,
  options?: GetPercentilesOptions,
) {
  const valueEvaluatorApi = useValueEvaluatorApi();
  const [debouncedRequest] = useDebounce(request, 250, { trailing: true });
  return useQuery({
    queryKey: valueEvaluatorApiQueryKey(["getPercentiles", debouncedRequest]),
    queryFn: () =>
      valueEvaluatorApi
        .getPercentilesRaw(debouncedRequest)
        .then(unwrapRawResponse),
    select: mapPercentiles,
    ...options,
  });
}
