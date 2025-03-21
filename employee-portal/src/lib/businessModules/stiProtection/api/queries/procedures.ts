/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PaginationProps, TableSortingProps } from "@eshg/lib-employee-portal";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import {
  ApiGetStiProtectionProceduresSortBy,
  ApiGetStiProtectionProceduresSortOrder,
  ApiStiProtectionProcedureOverview,
} from "@eshg/sti-protection-api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";
import { ProcedureFilters } from "@/lib/businessModules/stiProtection/components/procedures/proceduresTable/StiProtectionProceduresTableFilters";

import { proceduresQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<
  PaginationProps,
  "pageSize" | "pageNumber" | "pageSizeOptions"
>;

export function useStiProcedureQuery(procedureId?: string) {
  const options = useStiProcedureQueryOptions(procedureId);
  return useSuspenseQuery(options);
}

export function useStiProcedureQueryOptions(procedureId?: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return queryOptions({
    queryFn: () => {
      if (procedureId == null) {
        throw Error("The procedureId must not be null");
      }
      return stiProtectionApi.getStiProcedure(procedureId);
    },
    queryKey: proceduresQueryKey([procedureId, "details"]),
    enabled: procedureId != null,
  });
}

export function useStiProceduresQuery(
  page: PageRequest,
  sorting: TableSortingProps,
  filters: ProcedureFilters,
) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  const sortState =
    sorting.manualSorting === true
      ? sorting.sortingState[0]
      : sorting.initialSorting?.[0];

  return queryOptions({
    queryFn: ({ signal }) =>
      stiProtectionApi.getStiProcedures(
        mapSortBy(sortState?.id),
        mapSortOrder(sortState?.desc),
        page.pageNumber,
        page.pageSize,
        filters.creationDateStart,
        filters.creationDateEnd,
        filters.yearOfBirth,
        filters.appointmentDateStart,
        filters.appointmentDateEnd,
        filters.gender,
        filters.concern,
        filters.procedureStatus,
        filters.labStatus,
        filters.procedureOrigin,
        { signal },
      ),

    queryKey: proceduresQueryKey([
      "list",
      { page, sortState },
      makeFiltersQueryKeyPart(filters),
    ]),
  });
}

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

export function useAnonymousIdentificationDocumentQuery(procedureId: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return useFileDownload(() =>
    stiProtectionApi.getAnonymousIdentificationDocumentRaw({ id: procedureId }),
  );
}

type ColumnNames = keyof ApiStiProtectionProcedureOverview;
const SortByMap: Record<
  string,
  ApiGetStiProtectionProceduresSortBy | undefined
> = {
  createdAt: ApiGetStiProtectionProceduresSortBy.CreatedAt,
  sampleBarCode: ApiGetStiProtectionProceduresSortBy.SampleBarcode,
  appointmentStart: ApiGetStiProtectionProceduresSortBy.Appointment,
} as const satisfies Partial<
  Record<ColumnNames, ApiGetStiProtectionProceduresSortBy>
>;

function mapSortBy(sortBy?: string) {
  if (!sortBy) return;

  const mappedValue = SortByMap[sortBy];
  if (mappedValue) {
    return mappedValue;
  }
  throw Error(`Unexpected sort field: ${sortBy}`);
}

function mapSortOrder(
  desc: boolean | undefined,
): ApiGetStiProtectionProceduresSortOrder | undefined {
  if (desc == null) {
    return;
  }
  return desc
    ? ApiGetStiProtectionProceduresSortOrder.Desc
    : ApiGetStiProtectionProceduresSortOrder.Asc;
}
