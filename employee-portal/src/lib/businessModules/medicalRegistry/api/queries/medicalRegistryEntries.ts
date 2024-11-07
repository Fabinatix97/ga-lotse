/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiProcedureStatus } from "@eshg/employee-portal-api/businessProcedures";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useMedicalRegistryApi } from "@/lib/businessModules/medicalRegistry/api/clients";

import { medicalRegistryApiQueryKey } from "./apiQueryKeys";

interface PageRequest {
  pageNumber?: number;
  pageSize?: number;
  filterByCertificateRequested?: boolean;
  filterByStatus?: Set<ApiProcedureStatus>;
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

        { signal },
      ),

    queryKey: medicalRegistryApiQueryKey([
      "getProcedureOverview",
      page,
      Array.from(page.filterByStatus ?? []),
    ]),
  });
}
