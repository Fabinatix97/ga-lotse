/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions } from "@tanstack/react-query";

import { useAppointmentTypeApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { mapAppointmentTypeConfig } from "@/lib/businessModules/travelMedicine/api/models/AppointmentTypeConfig";
import { appointmentTypesApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllAppointmentTypesQuery() {
  const appointmentTypesApi = useAppointmentTypeApi();
  return queryOptions({
    queryKey: appointmentTypesApiQueryKey(["getAppointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) => response.appointmentTypeConfigDtos ?? [],
  });
}

export function useGetAllAppointmentTypesUnsuspended(open: boolean) {
  const appointmentTypesApi = useAppointmentTypeApi();
  return useHandledBackgroundQuery({
    queryKey: appointmentTypesApiQueryKey(["getAppointmentTypes"]),
    queryFn: () => appointmentTypesApi.getAppointmentTypes(),
    select: (response) =>
      response.appointmentTypeConfigDtos.map(mapAppointmentTypeConfig),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
  });
}
