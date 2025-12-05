/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SelectProps } from "@mui/joy";
import { ColumnSort, SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isDefined } from "remeda";

import { useSessionPersistence } from "../../../contexts/sessionPersistence";
import {
  SearchParamReplacement,
  useReplaceSearchParams,
} from "../../../hooks/useReplaceSearchParams";
import { PaginationProps } from "../components/pagination/Pagination";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "../config/pagination";
import { TableSortingProps } from "../types/tableSorting";

interface UseTableControlParams {
  pageNumberName?: string;
  pageSizeName?: string;
  defaultPageSize?: string;
  sortFieldName?: string;
  sortDirectionName?: string;
  serverSideSorting?: boolean;
  initialSorting?: ColumnSort;
  pageSizeOptions?: number[];
}

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

export interface UseTableControlResult {
  tableSorting: TableSortingProps;
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
  session?: TableControlSortingAndPaginationParams,
): TableSortingProps {
  const {
    pageNumberName = "pageNumber",
    sortFieldName = "sortField",
    sortDirectionName = "sortDirection",
    serverSideSorting = false,
  } = params;
  const sortField =
    searchParams.get(sortFieldName) ?? session?.sortField ?? null;
  const sortDirection =
    searchParams.get(sortDirectionName) ?? session?.sortDirection;
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
        replaceSearchParams([
          {
            name: pageNumberName,
            value: 0,
          },
          {
            name: sortFieldName,
            value: sortState?.id,
          },
          {
            name: sortDirectionName,
            value: isDefined(sortState)
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
  session?: TableControlSortingAndPaginationParams,
): CustomPaginationProps {
  const {
    pageNumberName = "pageNumber",
    pageSizeName = "pageSize",
    defaultPageSize = DEFAULT_PAGE_SIZE.toString(),
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  } = params;

  return {
    onPageSizeChange(_event: unknown, value: string | null) {
      replaceSearchParams([
        {
          name: pageNumberName,
          value: 0,
        },
        {
          name: pageSizeName,
          value,
        },
      ]);
    },

    onPageChange(value: number) {
      replaceSearchParams([
        {
          name: pageNumberName,
          value,
        },
      ]);
    },

    pageSize: parseInt(
      searchParams.get(pageSizeName) ?? session?.pageSize ?? defaultPageSize,
    ),
    pageNumber: parseInt(
      searchParams.get(pageNumberName) ??
        session?.pageNumber ??
        DEFAULT_PAGE_NUMBER.toString(),
    ),
    pageSizeOptions,
    alwaysShowPageSizeSelect: false,
  };
}

interface TableControlSortingAndPaginationParams {
  sortDirection?: string;
  sortField?: string;
  pageNumber?: string;
  pageSize?: string;
}

export function usePersistentTableControl(
  key: string,
  params: UseTableControlParams = {},
): UseTableControlResult {
  const sessionPersistence =
    useSessionPersistence<TableControlSortingAndPaginationParams>({
      key,
      initialValue: {
        sortDirection: params.initialSorting?.desc ? "desc" : "asc",
        sortField: params.initialSorting?.id,
        pageNumber: DEFAULT_PAGE_NUMBER.toString(),
        pageSize: params.defaultPageSize ?? DEFAULT_PAGE_SIZE.toString(),
      },
    });

  const tableControl = useTableControl(params, sessionPersistence.get());
  useEffect(() => {
    const manualTableSortingState = tableControl.tableSorting.manualSorting
      ? tableControl.tableSorting.sortingState[0]
      : params.initialSorting;

    sessionPersistence.set({
      sortDirection: manualTableSortingState?.desc ? "desc" : "asc",
      sortField: manualTableSortingState?.id,
      pageNumber:
        tableControl.paginationProps.pageNumber.toString() ??
        DEFAULT_PAGE_NUMBER.toString(),
      pageSize:
        tableControl.paginationProps.pageSize.toString() ??
        DEFAULT_PAGE_SIZE.toString(),
    });
  }, [
    tableControl.tableSorting,
    tableControl.paginationProps,
    params.initialSorting,
    sessionPersistence,
  ]);

  return tableControl;
}

export function useTableControl(
  params: UseTableControlParams = {},
  session?: TableControlSortingAndPaginationParams,
): UseTableControlResult {
  const searchParams = useSearchParams();
  const replaceSearchParams = useReplaceSearchParams();

  const { pageNumberName = "pageNumber" } = params;

  const paginationProps = getPaginationProps(
    params,
    searchParams,
    replaceSearchParams,
    session,
  );

  const tableSorting = getTableSortingProps(
    params,
    searchParams,
    replaceSearchParams,
    session,
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
