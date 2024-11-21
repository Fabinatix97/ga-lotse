/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";

import { stiProtectionProceduresApiQueryKey } from "./apiQueryKeys";

interface PageRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

export function useStiProcedureQuery(procedureId: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return useSuspenseQuery({
    queryFn: ({ signal }) =>
      stiProtectionApi.getStiProcedure(procedureId, { signal }),
    queryKey: stiProtectionProceduresApiQueryKey([procedureId]),
  });
}

export function useStiProceduresQuery(page: PageRequest) {
  const stiProtectionApi = useStiProtectionProcedureApi();

  return useSuspenseQuery({
    queryFn: ({ signal }) =>
      stiProtectionApi.getStiProcedures(
        page.sortBy,
        page.sortOrder,
        page.pageNumber,
        page.pageSize,
        { signal },
      ),

    queryKey: stiProtectionProceduresApiQueryKey([page]),
  });
}

export function useAnonymousIdentificationDocumentQuery(procedureId: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return useFileDownload(() =>
    stiProtectionApi.getAnonymousIdentificationDocumentRaw({ id: procedureId }),
  );
}
