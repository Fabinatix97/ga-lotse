/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { AppointmentTypeApi } from "@eshg/sti-protection-api";

import { useAppointmentTypeApi } from "@/lib/businessModules/stiProtection/api/clients";
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

export function useGetAllAppointmentTypes() {
  const appointmentTypeApi = useAppointmentTypeApi();
  return useSuspenseQuery(getAllAppointmentTypesQuery(appointmentTypeApi));
}
