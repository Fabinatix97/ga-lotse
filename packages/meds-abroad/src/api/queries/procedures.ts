/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { queryOptions, useQueries } from "@tanstack/react-query";

import { PaginationProps, TableSortingProps } from "@eshg/lib-employee-portal";
import {
  ApiGetMedsAbroadProceduresSortBy,
  ApiGetMedsAbroadProceduresSortOrder,
  ApiMedsAbroadProcedure,
} from "@eshg/meds-abroad-api";

import { ProcedureFilters } from "../../components/procedures/proceduresTable/MedsAbroadProceduresTableFilters";
import { useMedsAbroadApi } from "../clients";

import { proceduresQueryKey } from "./apiQueryKeys";

type PageRequest = Pick<
  PaginationProps,
  "pageSize" | "pageNumber" | "pageSizeOptions"
>;

function useProceduresQueryOptions(
  page: PageRequest,
  sorting: TableSortingProps,
  filters: ProcedureFilters,
) {
  const medsAbroadApi = useMedsAbroadApi();
  const sortState =
    sorting.manualSorting === true
      ? sorting.sortingState[0]
      : sorting.initialSorting?.[0];

  return queryOptions({
    queryFn: ({ signal }) =>
      medsAbroadApi.getMedsAbroadProcedures(
        page.pageNumber,
        page.pageSize,
        mapSortBy(sortState?.id),
        mapSortOrder(sortState?.desc),
        filters.creationDateStart,
        filters.creationDateEnd,
        undefined,
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

export function useGetMedsAbroadProceduresTablePage({
  filters,
  page,
  sorting,
}: {
  filters: ProcedureFilters;
  page: PageRequest;
  sorting: TableSortingProps;
}) {
  const medsAbroadProceduresQueryOptions = useProceduresQueryOptions(
    page,
    sorting,
    filters,
  );

  const [{ data: medsAbroadProceduresData, isLoading }] = useQueries({
    queries: [medsAbroadProceduresQueryOptions],
  });

  return {
    medsAbroadProceduresData: medsAbroadProceduresData ?? {
      procedures: [],
      totalElements: 0,
    },
    isLoading,
  };
}

type ColumnNames =
  | keyof ApiMedsAbroadProcedure
  | "person_firstName"
  | "person_lastName"
  | "person_dateOfBirth";
const SortByMap: Record<string, ApiGetMedsAbroadProceduresSortBy | undefined> =
  {
    person_firstName: ApiGetMedsAbroadProceduresSortBy.FirstName,
    person_lastName: ApiGetMedsAbroadProceduresSortBy.LastName,
    person_dateOfBirth: ApiGetMedsAbroadProceduresSortBy.DateOfBirth,
    createdAt: ApiGetMedsAbroadProceduresSortBy.CreatedAt,
  } as const satisfies Partial<
    Record<ColumnNames, ApiGetMedsAbroadProceduresSortBy>
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
): ApiGetMedsAbroadProceduresSortOrder | undefined {
  if (desc === undefined) {
    return;
  }
  return desc
    ? ApiGetMedsAbroadProceduresSortOrder.Desc
    : ApiGetMedsAbroadProceduresSortOrder.Asc;
}
