/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { GetProphylaxisSessionsRequest } from "@eshg/employee-portal-api/dental";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useProphylaxisSessionApi } from "@/lib/businessModules/dental/api/clients";
import { prophylaxisSessionApiQueryKey } from "@/lib/businessModules/dental/api/queries/apiQueryKeys";
import { mapProphylaxisSession } from "@/lib/businessModules/dental/models/ProphylaxisSession";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

export function useGetProphylaxisSessions(
  request: GetProphylaxisSessionsRequest,
) {
  const prophylaxisSessionApi = useProphylaxisSessionApi();

  return useSuspenseQuery({
    queryKey: prophylaxisSessionApiQueryKey([
      "getProphylaxisSessions",
      request,
    ]),
    queryFn: () =>
      prophylaxisSessionApi
        .getProphylaxisSessionsRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapProphylaxisSession),
  });
}
