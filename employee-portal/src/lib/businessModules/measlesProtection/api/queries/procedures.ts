/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { DeepKeys } from "@tanstack/react-table";

import { PaginationProps, TableSortingProps } from "@eshg/lib-employee-portal";
import {
  ApiGetMeaslesProtectionProceduresSortBy,
  ApiGetMeaslesProtectionProceduresSortOrder,
  ApiGetProcedure200Response,
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

function mapSortBy(sortBy?: string) {
  if (!sortBy) return;

  const mappedValue = SortByMap[sortBy];
  if (mappedValue) {
    return mappedValue;
  }

  throw Error(`Unexpected sort field: ${sortBy}`);
}

export function getProcedureQuery(
  protectionProcedureApi: ProtectionProcedureApi,
  procedureId: string,
) {
  return queryOptions({
    queryFn: ({ signal }) =>
      protectionProcedureApi.getProcedure(procedureId, { signal }),
    queryKey: measlesProtectionApiQueryKey(["getProcedure", procedureId]),
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

function mapSortOrder(
  sortOrder: boolean | undefined,
): ApiGetMeaslesProtectionProceduresSortOrder | undefined {
  if (sortOrder == null) {
    return;
  }
  return sortOrder
    ? ApiGetMeaslesProtectionProceduresSortOrder.Desc
    : ApiGetMeaslesProtectionProceduresSortOrder.Asc;
}

export function useGetProceduresQuery(
  page: PageRequest,
  sorting: TableSortingProps,
  filters: ProcedureFilters,
) {
  const sortState = sorting.manualSorting
    ? sorting.sortingState[0]
    : sorting.initialSorting?.[0];
  const protectionProcedureApi = useProtectionProcedureApi();
  return queryOptions({
    queryFn: ({ signal }) =>
      protectionProcedureApi.getProcedures(
        page.pageNumber,
        page.pageSize,
        mapSortBy(sortState?.id),
        mapSortOrder(sortState?.desc),
        filters.creationDate,
        filters.birthday,
        filters.facilityType,
        filters.caseStatus,
        filters.procedureStatus,
        filters.roleStatus,
        filters.hasAppointment,
        filters.measure,
        filters.proofRequestSent,
        filters.proofSubmissionResult,
        { signal },
      ),

    queryKey: measlesProtectionApiQueryKey([
      "procedures",
      "list",
      page,
      sortState,
      makeFiltersQueryKeyPart(filters),
    ]),
  });
}

// Apparently nested sets don't go down so well with Tanstack Query
function makeFiltersQueryKeyPart(filters: ProcedureFilters) {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => {
      if (value instanceof Set) {
        return [key, Array.from(value).join(",")];
      }

      return [key, value];
    }),
  );
}
