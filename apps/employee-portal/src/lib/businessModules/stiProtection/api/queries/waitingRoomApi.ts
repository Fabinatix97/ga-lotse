/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  ApiGetWaitingRoomProceduresResponse,
  GetWaitingRoomProceduresRequest,
} from "@eshg/sti-protection-api";

import { useWaitingRoomApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useGetWaitingRoomProcedures(
  request: GetWaitingRoomProceduresRequest,
) {
  const api = useWaitingRoomApi();
  return useSuspenseQuery({
    queryKey: stiProtectionApiQueryKey([
      "procedures",
      "waitingRoomList",
      request,
    ]),
    queryFn: () =>
      api
        .getWaitingRoomProceduresRaw(request)
        .then(
          (t) => t.raw.json() as Promise<ApiGetWaitingRoomProceduresResponse>,
        ),
    refetchInterval: 10_000,
  });
}
