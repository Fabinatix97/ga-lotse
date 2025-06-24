/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { AppointmentTypeApi } from "@eshg/school-entry-api";

import { mapAppointmentTypeConfig } from "@/lib/businessModules/schoolEntry/api/models/AppointmentTypeConfig";
import { appointmentTypesApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function getAllAppointmentTypesQuery(
  appointmentTypesApi: AppointmentTypeApi,
) {
  return queryOptions({
    queryKey: appointmentTypesApiQueryKey(["getAppointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) => ({
      appointmentTypeConfigs: response.appointmentTypeConfigDtos.map(
        mapAppointmentTypeConfig,
      ),
      allowedAppointmentTypeCombinations:
        response.allowedAppointmentTypeCombinations.map((it) => it.types),
    }),
  });
}
