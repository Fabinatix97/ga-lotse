/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiConcern,
  ApiCreateDailyAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/stiProtection/api/models/AppointmentBlockGroup";
import { concernToAppointmentType } from "@/lib/businessModules/stiProtection/shared/helpers";
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

interface GetFreeAppointmentsArgs {
  concern?: ApiConcern;
  earliestDate?: Date;
}
export function useGetFreeAppointments(request: GetFreeAppointmentsArgs) {
  const appointmentBlockApi = useAppointmentBlockApi();
  let concern = request.concern;
  if (concern == null) {
    concern = ApiAppointmentType.HivStiConsultation;
  }
  const modifiedRequest = { ...request, concern };

  return useQuery({
    queryKey: appointmentBlockApiQueryKey([
      "freeAppointments",
      modifiedRequest,
    ]),
    queryFn: () =>
      appointmentBlockApi.getFreeAppointments(
        concernToAppointmentType(modifiedRequest.concern),
        modifiedRequest.earliestDate,
      ),
    select: (data) => data.appointments,
    enabled: request.concern != null,
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
      request != null
        ? appointmentBlockApi.validateDailyAppointmentBlocksForGroup(request)
        : null,
  });
}
