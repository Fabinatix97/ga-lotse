/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiCreateAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/stiProtection/api/models/AppointmentBlockGroup";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

import { appointmentBlockApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentBlockGroups(
  request: GetAppointmentBlockGroupsRequest,
) {
  const appointmentBlockApi = useAppointmentBlockApi();

  return useSuspenseQuery({
    queryKey: appointmentBlockApiQueryKey(["appointmentBlockGroups", request]),
    queryFn: () =>
      appointmentBlockApi
        .getAppointmentBlockGroupsRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapAppointmentBlockGroup),
  });
}

export function useValidateAppointmentBlockGroup(
  request: ApiCreateAppointmentBlockGroupRequest | null,
) {
  const appointmentBlockApi = useAppointmentBlockApi();

  return useQuery({
    queryKey: appointmentBlockApiQueryKey([
      "validateAppointmentBlockGroup",
      request,
    ]),
    queryFn: () =>
      request != null
        ? appointmentBlockApi.validateAppointmentBlockGroup(request)
        : null,
  });
}
