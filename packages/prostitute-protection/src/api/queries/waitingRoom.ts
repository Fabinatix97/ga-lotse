/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { GetWaitingRoomProceduresRequest } from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

import { prostituteProtectionApiQueryKey } from "./apiQueryKeys";

export function useGetWaitingRoomProcedures(
  request: GetWaitingRoomProceduresRequest,
) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  return useSuspenseQuery({
    queryKey: prostituteProtectionApiQueryKey([
      "getWaitingRoomProcedures",
      request,
    ]),
    queryFn: () =>
      prostituteProtectionApi
        .getWaitingRoomProceduresRaw(request)
        .then(unwrapRawResponse),
    refetchInterval: 60_000,
  });
}
