/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultError, queryOptions, useQuery } from "@tanstack/react-query";
import { isNonNullish } from "remeda";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiAppointmentType,
  ApiCreateDailyAppointmentBlockGroupRequest,
  ApiProstituteProtectionProcedureType,
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
  procedureType: ApiProstituteProtectionProcedureType;
  earliestDate?: Date;
}

export function useGetFreeAppointments(request: GetFreeAppointmentsArgs) {
  const appointmentType = mapToAppointmentType(request.procedureType);
  const { appointmentBlockApi } = useProstituteProtectionApiClients();

  return useQuery({
    queryKey: appointmentBlockApiQueryKey([
      "freeAppointments",
      request,
      appointmentType,
    ]),
    queryFn: () => {
      if (
        request.procedureType === undefined ||
        request.procedureType === null
      ) {
        throw Error("Appointment type not specified");
      }
      return appointmentBlockApi.getFreeAppointments(
        appointmentType,
        request.earliestDate,
      );
    },
    select: (data) => data.appointments,
    enabled: isNonNullish(appointmentType),
  });
}

function mapToAppointmentType(
  procedureType: ApiProstituteProtectionProcedureType,
): ApiAppointmentType {
  switch (procedureType) {
    case "INITIAL":
      return ApiAppointmentType.ProstituteProtectionInitial;
    case "FOLLOW_UP":
      return ApiAppointmentType.ProstituteProtectionFollowUp;
  }
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
