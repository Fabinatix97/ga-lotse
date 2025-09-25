/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { QueryKeyFactory } from "@eshg/lib-portal";

import { AppointmentBlockApi } from "../AppointmentBlockApi";

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
