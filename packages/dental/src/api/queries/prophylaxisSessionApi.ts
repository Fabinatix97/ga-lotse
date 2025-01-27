/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GetProphylaxisSessionRequest,
  GetProphylaxisSessionsRequest,
  ProphylaxisSessionApi,
} from "@eshg/dental-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal/api/models/PaginatedList";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { mapProphylaxisSession } from "@/api/models/ProphylaxisSession";
import { mapProphylaxisSessionDetails } from "@/api/models/ProphylaxisSessionDetails";
import { useDentalApi } from "@/shared/DentalProvider";

import { prophylaxisSessionApiQueryKey } from "./apiQueryKeys";

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

export function getProphylaxisSessionQuery(
  prophylaxisSessionApi: ProphylaxisSessionApi,
  request: GetProphylaxisSessionRequest,
) {
  return queryOptions({
    queryKey: prophylaxisSessionApiQueryKey(["getProphylaxisSession", request]),
    queryFn: () =>
      prophylaxisSessionApi
        .getProphylaxisSessionRaw(request)
        .then(unwrapRawResponse),
    select: mapProphylaxisSessionDetails,
  });
}
