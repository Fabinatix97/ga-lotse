/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { mapPaginatedList } from "@eshg/lib-employee-portal/api/models/PaginatedList";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapAppointment } from "@/lib/businessModules/travelMedicine/api/models/Appointment";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/travelMedicine/api/models/AppointmentBlock";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAppointmentBlockGroupsQuery(
  request: GetAppointmentBlockGroupsRequest,
) {
  const appointmentApi = useAppointmentBlockApi();
  return queryOptions({
    queryKey: appointmentBlockApiQueryKey([
      "getAppointmentBlockGroups",
      request,
    ]),
    queryFn: () =>
      appointmentApi
        .getAppointmentBlockGroupsRaw(request)
        .then(unwrapRawResponse),
    select: mapPaginatedList(mapAppointmentBlockGroup),
  });
}

export function useGetFreeAppointmentsUnsuspended(
  appointmentType: ApiAppointmentType,
  earliestDate?: Date,
) {
  const appointmentApi = useAppointmentBlockApi();

  return useHandledBackgroundQuery({
    queryKey: appointmentBlockApiQueryKey([
      "getFreeAppointments",
      appointmentType,
      earliestDate,
    ]),
    queryFn: () =>
      appointmentApi.getFreeAppointments(appointmentType, earliestDate),
    select: (response) => response.appointments.map(mapAppointment),
    gcTime: 60000,
    staleTime: 60000,
  });
}

export function useGetFreeAppointmentsQuery(
  appointmentType: ApiAppointmentType,
  earliestDate?: Date,
) {
  const appointmentApi = useAppointmentBlockApi();
  return queryOptions({
    queryKey: appointmentBlockApiQueryKey([
      "getFreeAppointments",
      appointmentType,
      earliestDate,
    ]),
    queryFn: () =>
      appointmentApi.getFreeAppointments(appointmentType, earliestDate),
    select: (response) => response.appointments.map(mapAppointment),
  });
}

export function useValidateDailyAppointmentBlocksForGroup(
  data: ApiCreateDailyAppointmentBlockGroupRequest | null,
) {
  const appointmentApi = useAppointmentBlockApi();
  return useQuery({
    queryKey: appointmentBlockApiQueryKey([
      "validateDailyAppointmentBlocksForGroup",
      data,
    ]),
    queryFn: () =>
      data != null
        ? appointmentApi.validateDailyAppointmentBlocksForGroup(data)
        : null,
  });
}
