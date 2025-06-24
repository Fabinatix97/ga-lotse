/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useAppointmentTypeApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { mapAppointmentTypeConfig } from "@/lib/businessModules/officialMedicalService/api/models/AppointmentTypeConfig";
import { appointmentTypesApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetAllAppointmentTypesQuery() {
  const appointmentTypesApi = useAppointmentTypeApi();
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
