/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetStiProtectionProceduresSortBy,
  ApiGetStiProtectionProceduresSortOrder,
} from "@eshg/employee-portal-api/stiProtection";
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

// TODO ISSUE-6724: Align mapping of sortBy and sortOrder to the implementation of other business modules
function mapSortOrder(
  sortOrder: string | undefined,
): ApiGetStiProtectionProceduresSortOrder | undefined {
  if (sortOrder?.toUpperCase() === "ASC") {
    return ApiGetStiProtectionProceduresSortOrder.Asc;
  } else if (sortOrder?.toUpperCase() === "DESC") {
    return ApiGetStiProtectionProceduresSortOrder.Desc;
  } else if (sortOrder === undefined) {
    return undefined;
  }
}

// TODO ISSUE-6724: Align mapping of sortBy and sortOrder to the implementation of other business modules
function mapSortBy(
  sortBy: string | undefined,
): ApiGetStiProtectionProceduresSortBy | undefined {
  if (sortBy === undefined) {
    return undefined;
  }
  return sortBy as ApiGetStiProtectionProceduresSortBy;
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
        mapSortBy(page.sortBy),
        mapSortOrder(page.sortOrder),
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
