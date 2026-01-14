/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultError, queryOptions } from "@tanstack/react-query";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  type ApiValidateAppointmentBlockGroupResponse,
  AppointmentBlockApi,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/travel-medicine-api";

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

export function getValidateDailyAppointmentBlocksForGroupQuery(
  appointmentApi: AppointmentBlockApi,
  data: ApiCreateDailyAppointmentBlockGroupRequest,
) {
  return queryOptions<
    ApiValidateAppointmentBlockGroupResponse,
    DefaultError,
    ApiValidateAppointmentBlockGroupResponse,
    readonly unknown[]
  >({
    queryKey: appointmentBlockApiQueryKey([
      "validateDailyAppointmentBlocksForGroup",
      data,
    ]),
    queryFn: () => appointmentApi.validateDailyAppointmentBlocksForGroup(data),
  });
}
