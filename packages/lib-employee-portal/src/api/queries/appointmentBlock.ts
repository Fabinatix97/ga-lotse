/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultError,
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { addDays, startOfDay } from "date-fns";
import { isDefined } from "remeda";

import { QueryKeyFactory, unwrapRawResponse } from "@eshg/lib-portal";

import {
  AppointmentBlockApi,
  UpdateAppointmentBlockRequest,
  ValidateAppointmentBlockGroupResponse,
} from "../AppointmentBlockApi";

export function useGetAppointmentBlock(
  appointmentBlockId: string,
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
) {
  return useSuspenseQuery({
    queryKey: queryKey(["getAppointmentBlock", appointmentBlockId]),
    queryFn: () => appointmentBlockApi.getAppointmentBlock(appointmentBlockId),
  });
}

export function useGetAppointmentBlockRooms(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
) {
  return useQuery({
    queryKey: queryKey(["getAppointmentBlockRooms"]),
    queryFn: () => appointmentBlockApi.getAppointmentBlockRooms(),
    select: (response) => response.rooms,
  });
}

export function getValidateUpdateAppointmentBlockQuery(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
  request: UpdateAppointmentBlockRequest,
) {
  return queryOptions<
    ValidateAppointmentBlockGroupResponse,
    DefaultError,
    ValidateAppointmentBlockGroupResponse,
    readonly unknown[]
  >({
    queryKey: queryKey(["validateUpdateAppointmentBlock", request]),
    queryFn: () =>
      appointmentBlockApi
        .validateUpdateAppointmentBlock({
          appointmentBlockId: request.appointmentBlockId,
          apiUpdateAppointmentBlockRequest:
            request.apiUpdateAppointmentBlockRequest,
        })
        .then(unwrapRawResponse),
  });
}

export function getAppointmentBlocksForSingleDay(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
  timeRangeStart: Date,
) {
  const timeRangeEnd = startOfDay(addDays(timeRangeStart, 1));
  const getAppointmentBlocks = appointmentBlockApi.getAppointmentBlocks;

  return queryOptions({
    queryKey: queryKey([
      "getAppointmentBlocksForSingleDay",
      timeRangeStart,
      timeRangeEnd,
      isDefined(getAppointmentBlocks),
    ]),
    queryFn: () => getAppointmentBlocks!(timeRangeStart, timeRangeEnd),
    enabled: isDefined(getAppointmentBlocks),
  });
}

export function getAppointmentBlocks(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
  timeRangeStart: Date,
  timeRangeEnd: Date,
) {
  const getAppointmentBlocks = appointmentBlockApi.getAppointmentBlocks;

  return queryOptions({
    queryKey: queryKey([
      "getAppointmentBlocks",
      timeRangeStart,
      timeRangeEnd,
      isDefined(getAppointmentBlocks),
    ]),
    queryFn: () => getAppointmentBlocks!(timeRangeStart, timeRangeEnd),
    enabled: isDefined(getAppointmentBlocks),
  });
}

export function getAppointments(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
  timeRangeStart: Date,
  timeRangeEnd: Date,
) {
  const getAppointments = appointmentBlockApi.getAppointments;
  return queryOptions({
    queryKey: queryKey([
      "getAppointments",
      timeRangeStart,
      timeRangeEnd,
      isDefined(getAppointments),
    ]),
    queryFn: () => getAppointments!(timeRangeStart, timeRangeEnd),
    enabled: isDefined(getAppointments),
  });
}

export function useGetAppointment(
  appointmentBlockApi: AppointmentBlockApi,
  queryKey: QueryKeyFactory,
  appointmentId: number,
) {
  const getAppointment = appointmentBlockApi.getAppointment;
  return useQuery({
    queryKey: queryKey([
      "getAppointment",
      appointmentId,
      isDefined(getAppointment),
    ]),
    queryFn: () => getAppointment!(appointmentId),
    enabled: isDefined(getAppointment),
  });
}
