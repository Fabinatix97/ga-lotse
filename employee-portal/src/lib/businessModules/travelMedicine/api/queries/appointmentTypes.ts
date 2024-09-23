/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useAppointmentTypeApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { appointmentTypesApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllAppointmentTypes() {
  const appointmentTypesApi = useAppointmentTypeApi();
  return useSuspenseQuery({
    queryKey: appointmentTypesApiQueryKey(["getAppointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) => response.appointmentTypeConfigDtos ?? [],
  });
}

export function useGetOneAppointmentType(id: string) {
  const appointmentTypeApi = useAppointmentTypeApi();
  return useSuspenseQuery({
    queryKey: appointmentTypesApiQueryKey(["getOneAppointmentType", id]),
    queryFn: () => appointmentTypeApi.getOneAppointmentType(id),
  });
}
