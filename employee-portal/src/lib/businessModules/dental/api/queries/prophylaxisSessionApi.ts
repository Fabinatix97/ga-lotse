/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GetProphylaxisSessionRequest,
  GetProphylaxisSessionsRequest,
  ProphylaxisSessionApi,
} from "@eshg/employee-portal-api/dental";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useProphylaxisSessionApi } from "@/lib/businessModules/dental/api/clients";
import { mapProphylaxisSession } from "@/lib/businessModules/dental/api/models/ProphylaxisSession";
import { mapProphylaxisSessionDetails } from "@/lib/businessModules/dental/api/models/ProphylaxisSessionDetails";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

import { prophylaxisSessionApiQueryKey } from "./apiQueryKeys";

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

export function useGetProphylaxisSession(
  request: GetProphylaxisSessionRequest,
) {
  const prophylaxisSessionApi = useProphylaxisSessionApi();

  return useSuspenseQuery(
    getProphylaxisSessionQuery(prophylaxisSessionApi, request),
  );
}
