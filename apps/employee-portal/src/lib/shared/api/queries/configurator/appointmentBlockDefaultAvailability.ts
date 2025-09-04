/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetAppointmentBlockDefaultAvailabilityFlagsResponse } from "@eshg/school-entry-api";

import { useSchoolEntryAppointmentBlockDefaultAvailabilityApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetAppointmentBlockDefaultAvailability() {
  const appointmentBlockDefaultAvailabilityApi =
    useSchoolEntryAppointmentBlockDefaultAvailabilityApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "getConfiguredDefaultFlags",
      appointmentBlockDefaultAvailabilityApi,
    ]),
    queryFn: () =>
      appointmentBlockDefaultAvailabilityApi.getConfiguredDefaultFlags(),
    select: (data: ApiGetAppointmentBlockDefaultAvailabilityFlagsResponse) =>
      data.defaultFlags ?? {
        availableForCitizen: false,
        availableForBulkBooking: false,
      },
  });
}
