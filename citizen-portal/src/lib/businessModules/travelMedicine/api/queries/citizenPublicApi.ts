/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAppointmentType } from "@eshg/citizen-portal-api/travelMedicine";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useCitizenPublicApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/apiQueryKeys";

export function useGetAllDiseasesCitizen() {
  const citizenPublicApi = useCitizenPublicApi();
  return useSuspenseQuery({
    queryKey: citizenPublicApiQueryKey(["getPublicDiseases"]),
    queryFn: () => citizenPublicApi.getPublicDiseases(),
  });
}

export function useGetFreeAppointmentsForCitizen(
  appointmentType: ApiAppointmentType,
  earliestDate?: Date,
) {
  const citizenPublicApi = useCitizenPublicApi();

  return useSuspenseQuery({
    queryKey: citizenPublicApiQueryKey([
      "getFreeAppointmentsForCitizen",
      appointmentType,
      earliestDate,
    ]),
    queryFn: () =>
      citizenPublicApi.getFreeAppointmentsForCitizen(
        appointmentType,
        earliestDate,
      ),
    refetchOnWindowFocus: false,
  });
}

export function useGetDepartmentInfo() {
  const departmentApi = useCitizenPublicApi();
  return useSuspenseQuery({
    queryKey: citizenPublicApiQueryKey(["getDepartmentInfo"]),
    queryFn: () => departmentApi.getDepartmentInfo(),
  });
}
