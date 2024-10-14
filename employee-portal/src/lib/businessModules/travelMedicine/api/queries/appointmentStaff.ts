/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";
import { queryOptions } from "@tanstack/react-query";

import { useUserApi } from "@/lib/baseModule/api/clients";
import { mapUser } from "@/lib/businessModules/travelMedicine/api/models/User";
import { appointmentStaffApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetAllPhysiciansQuery() {
  const userApi = useUserApi();
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["getAllPhysicians"]),
    queryFn: () => userApi.getUsersByGroup("[System] RMBI-Arzt"),
    select: (response) => response.users ?? [],
  });
}

export function useGetAllPhysiciansUnsuspended(open: boolean) {
  const userApi = useUserApi();
  return useHandledBackgroundQuery({
    queryKey: appointmentStaffApiQueryKey(["getAllPhysicians"]),
    queryFn: () => userApi.getUsersByGroup("[System] RMBI-Arzt"),
    select: (response) => response.users.map(mapUser),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
  });
}

export function useGetAllMedicalAssistantsQuery() {
  const userApi = useUserApi();
  return queryOptions({
    queryKey: appointmentStaffApiQueryKey(["getAllMedicalAssistents"]),
    queryFn: () => userApi.getUsersByGroup("[System] RMBI-MFA"),
    select: (response) => response.users ?? [],
  });
}

export function useGetAllMedicalAssistantsUnsuspended(open: boolean) {
  const userApi = useUserApi();
  return useHandledBackgroundQuery({
    queryKey: appointmentStaffApiQueryKey(["getAllMedicalAssistents"]),
    queryFn: () => userApi.getUsersByGroup("[System] RMBI-MFA"),
    select: (response) => response.users.map(mapUser),
    enabled: open,
    gcTime: 60000,
    staleTime: 60000,
  });
}
