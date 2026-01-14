/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ApiGetAppointmentBlockAvailabilityResponse } from "@eshg/school-entry-api";

import { SchoolEntryAppointmentBlockAvailabilityFormModel } from "@/lib/configurator/components/shared/ConfiguratorDetails/SchoolEntryAppointmentBlockAvailability";
import { useSchoolEntryAppointmentBlockAvailabilityApi } from "@/lib/shared/api/clients";
import { configuratorApiQueryKey } from "@/lib/shared/api/queries/configurator/apiQueryKey";

export function useGetAppointmentBlockAvailability() {
  const appointmentBlockAvailabilityApi =
    useSchoolEntryAppointmentBlockAvailabilityApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "getConfiguredAvailability",
      appointmentBlockAvailabilityApi,
    ]),
    queryFn: () => appointmentBlockAvailabilityApi.getConfiguredAvailability(),
    select: mapResponse,
  });
}

function mapResponse(
  response: ApiGetAppointmentBlockAvailabilityResponse,
): SchoolEntryAppointmentBlockAvailabilityFormModel {
  return {
    availableForCitizen: response.defaultFlags?.availableForCitizen ?? false,
    availableForBulkBooking:
      response.defaultFlags?.availableForBulkBooking ?? false,
    bulkCreateAppointmentsMinLeadTime:
      response.leadTimes?.bulkCreateAppointmentsMinLeadTime ?? "",
    citizenFreeAppointmentsMinLeadTime:
      response.leadTimes?.citizenFreeAppointmentsMinLeadTime ?? "",
    citizenFreeAppointmentsMaxLeadTime:
      response.leadTimes?.citizenFreeAppointmentsMaxLeadTime ?? "",
  };
}
