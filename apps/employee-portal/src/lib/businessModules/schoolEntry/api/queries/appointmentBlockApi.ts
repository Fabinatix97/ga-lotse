/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DefaultError,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { addDays, startOfDay } from "date-fns";

import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  type ApiValidateAppointmentBlockGroupResponse,
  AppointmentBlockApi,
  GetAppointmentBlockGroupsRequest,
  UpdateAppointmentBlockRequest,
} from "@eshg/school-entry-api";

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

export function getValidateUpdateAppointmentBlockQuery(
  appointmentBlockApi: AppointmentBlockApi,
  request: UpdateAppointmentBlockRequest,
) {
  return queryOptions<
    ApiValidateAppointmentBlockGroupResponse,
    DefaultError,
    ApiValidateAppointmentBlockGroupResponse,
    readonly unknown[]
  >({
    queryKey: appointmentBlockApiQueryKey([
      "validateUpdateAppointmentBlock",
      request,
    ]),
    queryFn: () =>
      appointmentBlockApi.validateUpdateAppointmentBlock(
        request.appointmentBlockId,
        request.apiUpdateAppointmentBlockRequest,
      ),
  });
}

export function getAppointmentBlockQuery(
  appointmentBlockApi: AppointmentBlockApi,
  appointmentBlockId: string,
) {
  return queryOptions({
    queryKey: appointmentBlockApiQueryKey([
      "getAppointmentBlock",
      appointmentBlockId,
    ]),
    queryFn: () => appointmentBlockApi.getAppointmentBlock(appointmentBlockId),
  });
}

export function useGetAppointment(appointmentId: number) {
  const appointmentBlockApi = useAppointmentBlockApi();
  const result = useSuspenseQuery({
    queryKey: appointmentBlockApiQueryKey(["getAppointment", appointmentId]),
    queryFn: () => appointmentBlockApi.getAppointment(appointmentId),
  });
  return result.data;
}

export function useFetchAppointmentBlocksForSingleDay() {
  const appointmentBlockApi = useAppointmentBlockApi();
  return async (timeRangeStart: Date) => {
    const timeRangeEnd = startOfDay(addDays(timeRangeStart, 1));
    return appointmentBlockApi.getAppointmentBlocks(
      timeRangeStart,
      timeRangeEnd,
    );
  };
}

export function useFetchAppointmentBlocks() {
  const appointmentBlockApi = useAppointmentBlockApi();
  return async (timeRangeStart: Date, timeRangeEnd: Date) =>
    appointmentBlockApi.getAppointmentBlocks(timeRangeStart, timeRangeEnd);
}

export function useFetchAppointments() {
  const appointmentBlockApi = useAppointmentBlockApi();
  return async (timeRangeStart: Date, timeRangeEnd: Date) =>
    appointmentBlockApi.getAppointments(timeRangeStart, timeRangeEnd);
}
