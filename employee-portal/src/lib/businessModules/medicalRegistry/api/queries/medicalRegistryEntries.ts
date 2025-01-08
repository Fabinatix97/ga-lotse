/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { GetProcedureOverviewRequest } from "@eshg/employee-portal-api/medicalRegistry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";

import { medicalRegistryApiQueryKey } from "./apiQueryKeys";

export function useGetMedicalRegistryProcedureOverviewQuery(
  request: GetProcedureOverviewRequest | string,
) {
  const medicalRegistryApi = useMedicalRegistryApi();

  if (typeof request === "string") {
    return queryOptions({
      queryFn: () => medicalRegistryApi.searchProcedures1(request),
      queryKey: medicalRegistryApiQueryKey(["searchProcedures", request]),
    });
  }

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
