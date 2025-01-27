/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/employee-portal-api/stiProtection";
import { mapPaginatedList } from "@eshg/lib-employee-portal/api/models/PaginatedList";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/stiProtection/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/stiProtection/api/models/AppointmentBlockGroup";

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
  appointmentType?: ApiAppointmentType;
  earliestDate?: Date;
}
export function useGetFreeAppointments(request: GetFreeAppointmentsArgs) {
  const appointmentBlockApi = useAppointmentBlockApi();
  return useQuery({
    queryKey: appointmentBlockApiQueryKey(["freeAppointments", request]),
    queryFn: () => {
      if (request.appointmentType == null) {
        throw Error("Appointment type not specified");
      }
      return appointmentBlockApi.getFreeAppointments(
        request.appointmentType,
        request.earliestDate,
      );
    },
    select: (data) => data.appointments,
    enabled: request.appointmentType != null,
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
