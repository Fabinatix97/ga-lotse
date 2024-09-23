/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/employee-portal-api/travelMedicine";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentBlockApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/travelMedicine/api/models/AppointmentBlock";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";
import { mapPaginatedList } from "@/lib/shared/api/models/PaginatedList";

export function useGetAppointmentBlockGroups(
  request: GetAppointmentBlockGroupsRequest,
) {
  const appointmentApi = useAppointmentBlockApi();
  return useSuspenseQuery({
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

export function useGetFreeAppointments(
  appointmentType: ApiAppointmentType,
  earliestDate?: Date,
) {
  const appointmentApi = useAppointmentBlockApi();

  return useSuspenseQuery({
    queryKey: appointmentBlockApiQueryKey([
      "getFreeAppointments",
      appointmentType,
      earliestDate,
    ]),
    queryFn: () =>
      appointmentApi.getFreeAppointments(appointmentType, earliestDate),
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
