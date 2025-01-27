/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentTypeApi } from "@eshg/school-entry-api";
import { queryOptions } from "@tanstack/react-query";

import { mapAppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { appointmentTypesApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function getAllAppointmentTypesQuery(
  appointmentTypesApi: AppointmentTypeApi,
) {
  return queryOptions({
    queryKey: appointmentTypesApiQueryKey(["getAppointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) =>
      response.appointmentTypeConfigDtos.map(mapAppointmentTypeConfig),
  });
}
