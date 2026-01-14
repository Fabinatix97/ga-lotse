/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultError, queryOptions, useQuery } from "@tanstack/react-query";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  ApiValidateAppointmentBlockGroupResponse,
  AppointmentBlockApi,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { mapAppointmentBlockGroup } from "../models/AppointmentBlockGroup";

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

interface GetFreeAppointmentsArgs {
  appointmentType?: ApiAppointmentType;
  earliestDate?: Date;
}
export function useGetFreeAppointments(request: GetFreeAppointmentsArgs) {
  const { appointmentBlockApi } = useProstituteProtectionApiClients();
  return useQuery({
    queryKey: appointmentBlockApiQueryKey(["freeAppointments", request]),
    queryFn: () => {
      if (request.appointmentType === undefined) {
        throw Error("Appointment type not specified");
      }
      return appointmentBlockApi.getFreeAppointments(
        request.appointmentType,
        request.earliestDate,
      );
    },
    select: (data) => data.appointments,
    enabled: request.appointmentType !== undefined,
  });
}

export function getValidateDailyAppointmentBlocksForGroupQuery(
  appointmentBlockApi: AppointmentBlockApi,
  request: ApiCreateDailyAppointmentBlockGroupRequest,
) {
  return queryOptions<
    ApiValidateAppointmentBlockGroupResponse,
    DefaultError,
    ApiValidateAppointmentBlockGroupResponse,
    readonly unknown[]
  >({
    queryKey: appointmentBlockApiQueryKey([
      "validateDailyAppointmentBlocksForGroup",
      request,
    ]),
    queryFn: () =>
      appointmentBlockApi.validateDailyAppointmentBlocksForGroup(request),
  });
}
