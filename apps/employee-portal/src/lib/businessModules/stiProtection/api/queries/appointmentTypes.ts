/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { AppointmentTypeApi } from "@eshg/sti-protection-api";

import { appointmentTypesApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function getAllAppointmentTypesQuery(
  appointmentTypesApi: AppointmentTypeApi,
) {
  return queryOptions({
    queryKey: appointmentTypesApiQueryKey(["appointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) => ({
      appointmentTypeConfigs: response.appointmentTypeConfigDtos ?? [],
      allowedAppointmentTypeCombinations:
        response.allowedAppointmentTypeCombinations.map((it) => it.types),
    }),
  });
}
