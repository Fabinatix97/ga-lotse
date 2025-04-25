/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { GetProphylaxisSessionsRequest } from "@eshg/dental-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";

import { prophylaxisSessionApiQueryKey } from "@/config/apiQueryKeys";
import { useDentalApi } from "@/contexts/dental";
import { mapProphylaxisSession } from "@/features/prophylaxisSessions/api/models/ProphylaxisSession";

export function useGetProphylaxisSessions(
  request: GetProphylaxisSessionsRequest,
) {
  const { prophylaxisSessionApi } = useDentalApi();

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
