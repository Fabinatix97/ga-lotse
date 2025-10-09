/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DefaultError,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

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
