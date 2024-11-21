/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiWaitingRoom,
  UpdateWaitingRoomDetailsRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { useMutation } from "@tanstack/react-query";

import { useWaitingRoomApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpdateWaitingRoomDetails(
  events: MutationPassThrough<
    UpdateWaitingRoomDetailsRequest,
    ApiWaitingRoom
  > = {},
) {
  const api = useWaitingRoomApi();
  return useMutation({
    mutationKey: stiProtectionApiQueryKey(["procedures"]),
    mutationFn: (request: UpdateWaitingRoomDetailsRequest) =>
      api.updateWaitingRoomDetailsRaw(request).then(unwrapRawResponse),
    ...events,
  });
}
