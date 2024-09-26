/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AppointmentTypeApi } from "@eshg/employee-portal-api/stiProtection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentTypeApi } from "@/lib/businessModules/stiProtection/api/clients";
import { appointmentTypesApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function getAllAppointmentTypesQuery(
  appointmentTypesApi: AppointmentTypeApi,
) {
  return queryOptions({
    queryKey: appointmentTypesApiQueryKey(["appointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) => response.appointmentTypeConfigDtos ?? [],
  });
}

export function useGetAllAppointmentTypes() {
  const appointmentTypeApi = useAppointmentTypeApi();
  return useSuspenseQuery(getAllAppointmentTypesQuery(appointmentTypeApi));
}

export function useGetOneAppointmentType(id: string) {
  const appointmentTypeApi = useAppointmentTypeApi();
  return useSuspenseQuery({
    queryKey: appointmentTypesApiQueryKey(["getOneAppointmentType", id]),
    queryFn: () => appointmentTypeApi.getOneAppointmentType(id),
  });
}
