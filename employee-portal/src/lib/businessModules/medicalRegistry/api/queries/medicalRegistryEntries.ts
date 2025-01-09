/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  GetProcedureOverviewRequest,
  MedicalRegistryApi,
} from "@eshg/employee-portal-api/medicalRegistry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";

import { medicalRegistryApiQueryKey } from "./apiQueryKeys";

export function getMedicalRegistrySearchQuery(
  medicalRegistryApi: MedicalRegistryApi,
  searchQuery: string,
) {
  return queryOptions({
    queryFn: () => medicalRegistryApi.searchProcedures1(searchQuery),
    queryKey: medicalRegistryApiQueryKey(["searchProcedures", searchQuery]),
  });
}

export function getMedicalRegistryOverviewQuery(
  medicalRegistryApi: MedicalRegistryApi,
  request: GetProcedureOverviewRequest,
) {
  return queryOptions({
    queryFn: () =>
      medicalRegistryApi
        .getProcedureOverviewRaw(request)
        .then(unwrapRawResponse),
    queryKey: medicalRegistryApiQueryKey([
      "getProcedureOverview",
      request,
      Array.from(request.procedureStatus ?? []),
      Array.from(request.procedureType ?? []),
      Array.from(request.professionalTitle ?? []),
    ]),
  });
}

export function useGetProcedure(procedureId: string) {
  const medicalRegistryApi = useMedicalRegistryApi();

  return useSuspenseQuery({
    queryKey: medicalRegistryApiQueryKey(["getProcedureRaw", procedureId]),
    queryFn: () =>
      medicalRegistryApi
        .getProcedureRaw({ procedureId })
        .then(unwrapRawResponse),
  });
}
