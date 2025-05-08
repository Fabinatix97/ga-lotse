/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import {
  GetProphylaxisSessionRequest,
  ProphylaxisSessionApi,
} from "@eshg/dental-api";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";

import { prophylaxisSessionApiQueryKey } from "../../../../config/apiQueryKeys";
import { mapProphylaxisSessionDetails } from "../models/ProphylaxisSessionDetails";

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
