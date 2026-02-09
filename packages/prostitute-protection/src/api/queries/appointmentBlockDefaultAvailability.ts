/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { AppointmentBlockDefaultAvailabilityApi } from "@eshg/prostitute-protection-api";

import { appointmentBlockDefaultAvailabilityApiQueryKey } from "./apiQueryKeys";

export function useGetAppointmentBlockDefaultAvailabilityOptions(
  appointmentBlockDefaultAvailabilityApi: AppointmentBlockDefaultAvailabilityApi,
) {
  return queryOptions({
    queryKey: appointmentBlockDefaultAvailabilityApiQueryKey([
      "getDefaultFlags",
      appointmentBlockDefaultAvailabilityApi,
    ]),
    queryFn: () => appointmentBlockDefaultAvailabilityApi.getDefaultFlags(),
  });
}
