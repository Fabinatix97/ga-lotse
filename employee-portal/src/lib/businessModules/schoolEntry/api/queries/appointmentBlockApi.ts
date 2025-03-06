/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  AppointmentBlockApi,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/school-entry-api";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/schoolEntry/api/models/AppointmentBlockGroup";

import { appointmentBlockApiQueryKey } from "./apiQueryKeys";

export function getAppointmentBlockGroupsQuery(
  appointmentBlockApi: AppointmentBlockApi,
  request: GetAppointmentBlockGroupsRequest,
) {
  return queryOptions({
    queryKey: appointmentBlockApiQueryKey([
      "getAppointmentBlockGroups",
      request,
    ]),
    queryFn: () =>
      appointmentBlockApi
        .getAppointmentBlockGroupsRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapAppointmentBlockGroup),
  });
}

export function useValidateDailyAppointmentBlocksForGroup(
  request: ApiCreateDailyAppointmentBlockGroupRequest | null,
) {
  const appointmentBlockApi = useAppointmentBlockApi();
  return useQuery({
    queryKey: appointmentBlockApiQueryKey([
      "validateDailyAppointmentBlocksForGroup",
      request,
    ]),
    queryFn: () =>
      request !== null
        ? appointmentBlockApi.validateDailyAppointmentBlocksForGroup(request)
        : Promise.reject(new Error("Request is not defined")),
    enabled: request !== null,
  });
}
