/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { AppointmentBlockDefaultAvailabilityApi } from "@eshg/school-entry-api";

import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function getAppointmentBlockDefaultAvailabilityQuery(
  appointmentBlockDefaultAvailabilityApi: AppointmentBlockDefaultAvailabilityApi,
) {
  return queryOptions({
    queryKey: configuratorApiQueryKey([
      "getDefaultFlags",
      appointmentBlockDefaultAvailabilityApi,
    ]),
    queryFn: () => appointmentBlockDefaultAvailabilityApi.getDefaultFlags(),
  });
}
