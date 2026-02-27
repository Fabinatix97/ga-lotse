/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DefaultError, queryOptions } from "@tanstack/react-query";

import {
  ApiCreateDailyAppointmentBlockGroupRequest,
  ApiValidateAppointmentBlockGroupResponse,
  AppointmentBlockApi,
  GetAppointmentBlockGroupsRequest,
} from "@eshg/infection-briefing-api";
import { mapPaginatedList } from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";

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
