/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetMeaslesProtectionProceduresSortOrder,
  ProtectionProcedureApi,
} from "@eshg/employee-portal-api/measlesProtection";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useProtectionProcedureApi } from "@/lib/businessModules/measlesProtection/api/clients";
import { ProcedureFilters } from "@/lib/businessModules/measlesProtection/components/procedures/proceduresTable/ProceduresTableFilters";

import { measlesProtectionApiQueryKey } from "./apiQueryKeys";

function mapTableFieldToSortField(sortBy?: string) {
  if (!sortBy) return;

  switch (sortBy) {
    case "id":
      throw Error("Not implemented");
    case "affectedPerson_firstName":
      return "FIRST_NAME";
    case "affectedPerson_lastName":
      return "LAST_NAME";
    case "affectedPerson_dateOfBirth":
      return "DATE_OF_BIRTH";
    case "createdAt":
      return "CREATED_AT";
    case "facility_name":
      return "FACILITY_NAME";
    case "facility_type":
      return "FACILITY_TYPE";
    case "procedureStatus":
      return "PROCEDURE_STATUS";
    case "caseStatus":
      return "CASE_STATUS";
    default:
      throw Error(`Unexpected sort field: ${sortBy}`);
  }
}

interface PageRequest {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: string;
}

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

// TODO ISSUE-6724: Align mapping of sortBy and sortOrder to the implementation of other business modules
function mapSortOrder(
  sortOrder: string | undefined,
): ApiGetMeaslesProtectionProceduresSortOrder | undefined {
  if (sortOrder?.toUpperCase() === "ASC") {
    return ApiGetMeaslesProtectionProceduresSortOrder.Asc;
  } else if (sortOrder?.toUpperCase() === "DESC") {
    return ApiGetMeaslesProtectionProceduresSortOrder.Desc;
  } else if (sortOrder === undefined) {
    return undefined;
  }
}

export function useProceduresQuery(
  page: PageRequest,
  filters: ProcedureFilters,
) {
  const protectionProcedureApi = useProtectionProcedureApi();

  return useSuspenseQuery({
    queryFn: ({ signal }) =>
      protectionProcedureApi.getProcedures(
        page.pageNumber,
        page.pageSize,
        mapTableFieldToSortField(page.sortBy),
        mapSortOrder(page.sortOrder),
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
