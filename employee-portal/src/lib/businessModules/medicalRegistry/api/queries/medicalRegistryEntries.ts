/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureStatus } from "@eshg/employee-portal-api/businessProcedures";
import { ApiProfessionalTitle } from "@eshg/employee-portal-api/medicalRegistry";
import { unwrapRawResponse } from "@eshg/lib-portal/api/unwrapRawResponse";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";

import { medicalRegistryApiQueryKey } from "./apiQueryKeys";

interface PageRequest {
  pageNumber?: number;
  pageSize?: number;
  filterByCertificateRequested?: boolean;
  filterByStatus?: Set<ApiProcedureStatus>;
  filterByProfessionalTitle?: Set<ApiProfessionalTitle>;
}

export function useGetMedicalRegistryProcedureOverviewQuery(page: PageRequest) {
  const medicalRegistryApi = useMedicalRegistryApi();

  return useSuspenseQuery({
    queryFn: ({ signal }) =>
      medicalRegistryApi.getProcedureOverview(
        page.pageSize,
        page.pageNumber,
        page.filterByCertificateRequested,
        page.filterByStatus,
        page.filterByProfessionalTitle,
        { signal },
      ),
    queryKey: medicalRegistryApiQueryKey([
      "getProcedureOverview",
      page,
      Array.from(page.filterByStatus ?? []),
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
