/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/official-medical-service-api";

import { useAppointmentBlockApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { mapAppointmentBlockGroup } from "@/lib/businessModules/officialMedicalService/api/models/AppointmentBlockGroup";
import { appointmentBlockApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

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
      data !== null
        ? appointmentApi.validateDailyAppointmentBlocksForGroup(data)
        : null,
  });
}

export function useGetFreeAppointmentsQuery(
  appointmentType: ApiAppointmentType,
  physicianId?: string,
) {
  const appointmentApi = useAppointmentBlockApi();
  return useSuspenseQuery({
    queryKey: appointmentBlockApiQueryKey([
      "getFreeAppointments",
      appointmentType,
      physicianId,
    ]),
    queryFn: () =>
      appointmentApi.getFreeAppointments(
        appointmentType,
        undefined,
        physicianId,
      ),
  });
}
