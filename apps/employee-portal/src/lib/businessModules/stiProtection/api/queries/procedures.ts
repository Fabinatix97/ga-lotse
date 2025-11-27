/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  queryOptions,
  useQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";

import {
  PaginationProps,
  TableSortingProps,
  getSortDirection,
  getSortKey,
} from "@eshg/lib-employee-portal";
import { unwrapRawResponse, useFileDownload } from "@eshg/lib-portal";
import {
  ApiGetStiProtectionProceduresSortBy,
  GetStiProceduresRequest,
} from "@eshg/sti-protection-api";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";
import { ProcedureFilters } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresTableFilters";

import { proceduresQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<
  PaginationProps,
  "pageSize" | "pageNumber" | "pageSizeOptions"
>;

export function useStiProcedureQueryOptions(procedureId?: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return queryOptions({
    queryFn: () => {
      if (procedureId === undefined) {
        throw Error("The procedureId must not be null");
      }
      return stiProtectionApi.getStiProcedure(procedureId);
    },
    queryKey: proceduresQueryKey([procedureId, "details"]),
    enabled: procedureId !== undefined,
  });
}

export function useStiProcedureQuery(procedureId?: string) {
  const options = useStiProcedureQueryOptions(procedureId);
  return useSuspenseQuery(options);
}

function useStiProceduresQueryOptions(
  page: PageRequest,
  sorting: TableSortingProps,
  filters: ProcedureFilters,
) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  const sortKey = getSortKey(sorting, SortByMap);

  const request: GetStiProceduresRequest = {
    sortBy: sortKey,
    sortOrder: getSortDirection(sorting),
    pageNumber: page.pageNumber,
    pageSize: page.pageSize,
    creationDateStart: filters.creationDateStart,
    creationDateEnd: filters.creationDateEnd,
    yearOfBirth: filters.yearOfBirth,
    appointmentDateStart: filters.appointmentDateStart,
    appointmentDateEnd: filters.appointmentDateEnd,
    gender: filters.gender,
    concern: filters.concern,
    procedureStatus: filters.procedureStatus,
    labStatus: filters.labStatus,
    procedureOrigin: filters.procedureOrigin,
  };

  return queryOptions({
    queryFn: ({ signal }) =>
      stiProtectionApi
        .getStiProceduresRaw(request, { signal })
        .then(unwrapRawResponse),

    queryKey: proceduresQueryKey(["list", { request }]),
  });
}

function useStiProceduresSearchQueryOptions(searchQuery: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();

  return queryOptions({
    queryFn: () => stiProtectionApi.findProcedures(searchQuery),
    queryKey: proceduresQueryKey(["searchProcedures", searchQuery]),
  });
}

export function useGetStiProceduresTablePage({
  filters,
  page,
  searchQuery,
  sorting,
}: {
  filters: ProcedureFilters;
  page: PageRequest;
  searchQuery: string;
  sorting: TableSortingProps;
}) {
  const stiProceduresQueryOptions = useStiProceduresQueryOptions(
    page,
    sorting,
    filters,
  );
  const stiProtectionSearchQueryOptions =
    useStiProceduresSearchQueryOptions(searchQuery);

  const proceduresQuery = searchQuery
    ? stiProtectionSearchQueryOptions
    : stiProceduresQueryOptions;

  const [{ data: stiProceduresData, isLoading }] = useQueries({
    queries: [proceduresQuery],
  });

  return {
    stiProceduresData: stiProceduresData ?? {
      procedures: [],
      totalElements: 0,
    },
    isLoading,
  };
}

export function useAnonymousIdentificationDocumentQuery(procedureId: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return useFileDownload(() =>
    stiProtectionApi.getAnonymousIdentificationDocumentRaw({ id: procedureId }),
  );
}

const SortByMap: Record<string, ApiGetStiProtectionProceduresSortBy> = {
  createdAt: ApiGetStiProtectionProceduresSortBy.CreatedAt,
  sampleBarCode: ApiGetStiProtectionProceduresSortBy.SampleBarcode,
  appointmentStart: ApiGetStiProtectionProceduresSortBy.Appointment,
};
