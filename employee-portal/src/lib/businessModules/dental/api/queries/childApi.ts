/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetChildrenRequest } from "@eshg/employee-portal-api/dental";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useChildApi } from "@/lib/businessModules/dental/api/clients";
import { childApiQueryKey } from "@/lib/businessModules/dental/api/queries/apiQueryKeys";
import { mapChild } from "@/lib/businessModules/dental/models/Child";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

export function useGetChildren(request: GetChildrenRequest) {
  const childApi = useChildApi();

  return useSuspenseQuery({
    queryKey: childApiQueryKey(["getChildren", request]),
    queryFn: () => childApi.getChildrenRaw(request).then(unwrapRawResponse),
    select: mapPaginatedList(mapChild),
  });
}
