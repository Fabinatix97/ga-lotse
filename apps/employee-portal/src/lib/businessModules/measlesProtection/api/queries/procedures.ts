/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { DeepKeys } from "@tanstack/react-table";
import { isDefined } from "remeda";

import {
  PaginationProps,
  TableSortingProps,
  getSortDirection,
  getSortKey,
} from "@eshg/lib-employee-portal";
import { unwrapRawResponse } from "@eshg/lib-portal";
import {
  ApiGetMeaslesProtectionProceduresSortBy,
  ApiGetProcedure200Response,
  GetProceduresRequest,
  ProtectionProcedureApi,
} from "@eshg/measles-protection-api";

import {
  useDraftProcedureApi,
  useProtectionProcedureApi,
} from "@/lib/businessModules/measlesProtection/api/clients";
import { ProcedureFilters } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ProceduresTableFilters";

import { measlesProtectionApiQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<
  PaginationProps,
  "pageSize" | "pageNumber" | "pageSizeOptions"
>;

type DotToUnderscore<T> = T extends `${infer A}.${infer B}`
  ? DotToUnderscore<`${A}_${B}`>
  : T;

type ProcedureTableColumnNames = DotToUnderscore<
  DeepKeys<ApiGetProcedure200Response>
>;

const SortByMap: Record<string, ApiGetMeaslesProtectionProceduresSortBy> = {
  affectedPerson_firstName: ApiGetMeaslesProtectionProceduresSortBy.FirstName,
  affectedPerson_lastName: ApiGetMeaslesProtectionProceduresSortBy.LastName,
  affectedPerson_dateOfBirth:
    ApiGetMeaslesProtectionProceduresSortBy.DateOfBirth,
  createdAt: ApiGetMeaslesProtectionProceduresSortBy.CreatedAt,
  facility_name: ApiGetMeaslesProtectionProceduresSortBy.FacilityName,
  facility_type: ApiGetMeaslesProtectionProceduresSortBy.FacilityType,
  procedureStatus: ApiGetMeaslesProtectionProceduresSortBy.ProcedureStatus,
  caseStatus: ApiGetMeaslesProtectionProceduresSortBy.CaseStatus,
} as const satisfies Partial<
  Record<ProcedureTableColumnNames, ApiGetMeaslesProtectionProceduresSortBy>
>;

export function getProcedureQuery(
  protectionProcedureApi: ProtectionProcedureApi,
  procedureId: string,
) {
  return queryOptions({
    queryFn: ({ signal }) =>
      protectionProcedureApi.getProcedure(procedureId, { signal }),
    queryKey: measlesProtectionApiQueryKey(["procedures", procedureId]),
  });
}

export function useProcedureQuery(procedureId: string) {
  const protectionProcedureApi = useProtectionProcedureApi();

  return useSuspenseQuery(
    getProcedureQuery(protectionProcedureApi, procedureId),
  );
}

export function useGetHeaderInformation(procedureId: string) {
  const api = useDraftProcedureApi();
  return useSuspenseQuery({
    queryFn: () => api.getDraftHeaderInformation(procedureId),
    queryKey: measlesProtectionApiQueryKey([
      "getDraftHeaderInformation",
      procedureId,
    ]),
  });
}

export function useGetProceduresQuery(
  page: PageRequest,
  sorting: TableSortingProps,
  filters: ProcedureFilters,
) {
  const sortKey = getSortKey(sorting, SortByMap);
  const protectionProcedureApi = useProtectionProcedureApi();
  const request: GetProceduresRequest = {
    pageNumber: page.pageNumber,
    pageSize: page.pageSize,
    sortBy: sortKey,
    sortOrder: getSortDirection(sorting),
    creationDate: filters.creationDate,
    birthday: filters.birthday,
    facilityType: filters.facilityType,
    caseStatus: filters.caseStatus,
    procedureStatus: filters.procedureStatus,
    roleStatus: filters.roleStatus,
    hasAppointment: filters.hasAppointment,
    measure: filters.measure,
    proofRequestSent: filters.proofRequestSent,
    proofSubmissionResult: filters.proofSubmissionResult,
  };

  return queryOptions({
    queryFn: ({ signal }) =>
      protectionProcedureApi
        .getProceduresRaw(request, { signal })
        .then(unwrapRawResponse),

    queryKey: measlesProtectionApiQueryKey(["procedures", "list", request]),
  });
}

export function getProceduresByPersonQuery(
  protectionProcedureApi: ProtectionProcedureApi,
  id: string | undefined,
) {
  return queryOptions({
    queryKey: measlesProtectionApiQueryKey(["getProceduresByPerson", id]),
    queryFn: () =>
      isDefined(id)
        ? protectionProcedureApi
            .getProceduresForPersonRaw({ id })
            .then(unwrapRawResponse)
        : Promise.reject(new Error("Expected personId to be defined")),
    select: (response) => response.procedures,
    enabled: isDefined(id),
  });
}
