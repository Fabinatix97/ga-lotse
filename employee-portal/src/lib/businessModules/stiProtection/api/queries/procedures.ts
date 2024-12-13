/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiGetStiProtectionProceduresSortBy,
  ApiGetStiProtectionProceduresSortOrder,
  ApiStiProtectionProcedureOverview,
} from "@eshg/employee-portal-api/stiProtection";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { useStiProtectionProcedureApi } from "@/lib/businessModules/stiProtection/api/clients";
import { PaginationProps } from "@/lib/shared/components/pagination/Pagination";
import {
  AutomaticSortingProps,
  ManualSortingProps,
} from "@/lib/shared/components/table/DataTable";

import { stiProtectionProceduresApiQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<
  PaginationProps,
  "pageSize" | "pageNumber" | "pageSizeOptions"
>;
type SortingRequest = ManualSortingProps | AutomaticSortingProps;

export function useStiProcedureQuery(procedureId: string) {
  const stiProtectionApi = useStiProtectionProcedureApi();
  return useSuspenseQuery({
    queryFn: ({ signal }) =>
      stiProtectionApi.getStiProcedure(procedureId, { signal }),
    queryKey: stiProtectionProceduresApiQueryKey([procedureId]),
  });
}

export function useStiProceduresQuery(
  page: PageRequest,
  sorting: SortingRequest,
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
        { signal },
      ),

    queryKey: stiProtectionProceduresApiQueryKey([{ page, sortState }]),
  });
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
  yearOfBirth: ApiGetStiProtectionProceduresSortBy.YearOfBirth,
  gender: ApiGetStiProtectionProceduresSortBy.Gender,
  status: ApiGetStiProtectionProceduresSortBy.Status,
  concern: ApiGetStiProtectionProceduresSortBy.Concern,
  createdAt: ApiGetStiProtectionProceduresSortBy.CreatedAt,
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
