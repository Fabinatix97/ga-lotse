/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetPercentilesRequest } from "@eshg/employee-portal-api/schoolEntry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

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
