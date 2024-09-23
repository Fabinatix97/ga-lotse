/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectProps } from "@mui/joy";
import { ColumnSort, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { isDefined } from "remeda";

import { PaginationProps } from "@/lib/shared/components/pagination/Pagination";
import { defaultPageSizeOptions } from "@/lib/shared/components/pagination/paginationHelper";
import {
  AutomaticSortingProps,
  ManualSortingProps,
} from "@/lib/shared/components/table/DataTable";
import {
  SearchParamReplacement,
  useReplaceSearchParams,
} from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

interface UseTableControlParams {
  pageNumberName?: string;
  pageSizeName?: string;
  defaultPageSize?: string;
  sortFieldName?: string;
  sortDirectionName?: string;
  serverSideSorting?: boolean;
  initialSorting?: ColumnSort;
}

export type CustomSortingProps = ManualSortingProps | AutomaticSortingProps;

type CustomPaginationProps = Pick<
  PaginationProps,
  | "onPageSizeChange"
  | "onPageChange"
  | "pageSize"
  | "pageNumber"
  | "pageSizeOptions"
  | "alwaysShowPageSizeSelect"
>;

interface SearchRequest {
  searchParamName: string;
  value: string;
  relevanceSortFieldName?: string;
}

export interface UseTableControl {
  tableSorting: CustomSortingProps;
  paginationProps: CustomPaginationProps;
  getFilter: (paramName: string) => string | null;
  getFilterList: (paramName: string) => string[];
  setFilter: (
    replacements: SearchParamReplacement[],
    resetPage?: boolean,
  ) => void;
  setSearchRequest: (request: SearchRequest) => void;
  getSingleSelectProps: (searchParamName: string) => SelectProps<string, false>;
  getMultiSelectProps: (searchParamName: string) => SelectProps<string, true>;
}

function getTableSortingProps(
  params: UseTableControlParams,
  searchParams: ReturnType<typeof useSearchParams>,
  replaceSearchParams: ReturnType<typeof useReplaceSearchParams>,
): CustomSortingProps {
  const {
    pageNumberName = "pageNumber",
    sortFieldName = "sortField",
    sortDirectionName = "sortDirection",
    serverSideSorting = false,
  } = params;

  const sortField = searchParams.get(sortFieldName);
  const sortDirection = searchParams.get(sortDirectionName);
  const sortingState =
    sortField !== null
      ? [{ id: sortField, desc: sortDirection === "desc" }]
      : isDefined(params.initialSorting)
        ? [params.initialSorting]
        : [];

  if (serverSideSorting) {
    return {
      manualSorting: true,
      onSortingChange: (state?: SortingState) => {
        const defined = isDefined(state) && state.length > 0;
        const sortState = defined ? state[state.length - 1] : undefined;
        const isInitialSorting =
          sortState?.id === params.initialSorting?.id &&
          sortState?.desc === params.initialSorting?.desc;
        replaceSearchParams([
          {
            name: pageNumberName,
            value: undefined,
          },
          {
            name: sortFieldName,
            value: !isInitialSorting ? sortState?.id : undefined,
          },
          {
            name: sortDirectionName,
            value:
              isDefined(sortState) && !isInitialSorting
                ? sortState?.desc
                  ? "desc"
                  : "asc"
                : undefined,
          },
        ]);
      },
      sortingState,
    };
  } else {
    return {
      manualSorting: false,
      initialSorting: sortingState,
    };
  }
}

function getPaginationProps(
  params: UseTableControlParams,
  searchParams: ReturnType<typeof useSearchParams>,
  replaceSearchParams: ReturnType<typeof useReplaceSearchParams>,
): CustomPaginationProps {
  const {
    pageNumberName = "pageNumber",
    pageSizeName = "pageSize",
    defaultPageSize = "25",
  } = params;

  return {
    onPageSizeChange(_event: unknown, value: string | null) {
      replaceSearchParams([
        {
          name: pageNumberName,
          value: undefined,
        },
        {
          name: pageSizeName,
          value: value === defaultPageSize ? undefined : value,
        },
      ]);
    },

    onPageChange(value: number) {
      replaceSearchParams([
        {
          name: pageNumberName,
          value: value === 0 ? undefined : value,
        },
      ]);
    },

    pageSize: parseInt(searchParams.get(pageSizeName) ?? defaultPageSize),
    pageNumber: parseInt(searchParams.get(pageNumberName) ?? "0"),
    pageSizeOptions: defaultPageSizeOptions,
    alwaysShowPageSizeSelect: false,
  };
}

export function useTableControl(
  params: UseTableControlParams = {},
): UseTableControl {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const { pageNumberName = "pageNumber" } = params;

  const paginationProps = getPaginationProps(
    params,
    searchParams,
    replaceSearchParams,
  );

  const tableSorting = getTableSortingProps(
    params,
    searchParams,
    replaceSearchParams,
  );

  function getFilter(paramName: string) {
    return searchParams.get(paramName);
  }

  function getFilterList(paramName: string) {
    return searchParams.getAll(paramName);
  }

  function setFilter(replacements: SearchParamReplacement[], resetPage = true) {
    if (resetPage) {
      replacements = [
        {
          name: pageNumberName,
          value: undefined,
        },
        ...replacements,
      ];
    }

    replaceSearchParams(replacements);
  }

  function setSearchRequest({
    searchParamName,
    value,
    relevanceSortFieldName,
  }: SearchRequest) {
    const isEmpty = value.trim().length === 0;
    const filters = [
      {
        name: searchParamName,
        value: isEmpty ? undefined : value,
      },
    ];
    if (isDefined(relevanceSortFieldName)) {
      filters.push(
        {
          name: params.sortFieldName ?? "sortField",
          value: isEmpty ? undefined : relevanceSortFieldName,
        },
        {
          name: params.sortDirectionName ?? "sortDirection",
          value: isEmpty ? undefined : "DESC",
        },
      );
    }

    setFilter(filters);
  }

  return {
    getFilter,
    getFilterList,
    setFilter,
    setSearchRequest,
    getSingleSelectProps(searchParamName) {
      return {
        value: getFilter(searchParamName),
        multiple: false,
        onChange(_event, value) {
          setFilter([
            {
              name: searchParamName,
              value,
            },
          ]);
        },
      };
    },
    getMultiSelectProps(searchParamName) {
      return {
        value: getFilterList(searchParamName),
        multiple: true,
        onChange(_event, value) {
          setFilter([
            {
              name: searchParamName,
              value,
            },
          ]);
        },
      };
    },

    paginationProps,
    tableSorting,
  };
}
