/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { GetWaitingRoomProceduresRequest } from "@eshg/official-medical-service-api";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useWaitingRoomApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { waitingRoomApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetWaitingRoomProcedures(
  request: GetWaitingRoomProceduresRequest,
) {
  const waitingRoomApi = useWaitingRoomApi();
  return useSuspenseQuery({
    queryKey: waitingRoomApiQueryKey(["getWaitingRoomProcedures", request]),
    queryFn: () =>
      waitingRoomApi
        .getWaitingRoomProceduresRaw(request)
        .then(unwrapRawResponse),
  });
}
