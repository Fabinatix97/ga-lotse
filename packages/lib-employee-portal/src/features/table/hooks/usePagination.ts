/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { startTransition, useState } from "react";
import { isNonNull } from "remeda";

import { PaginationProps } from "@/features/table/components/pagination/Pagination";
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_SIZE_OPTIONS,
} from "@/features/table/config/pagination";

interface UsePagination {
  resetPageNumber: () => void;
  page: number;
  pageSize: number;
  getPaginationProps: (params: { totalCount: number }) => PaginationProps;
}

export function usePagination(): UsePagination {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(0);

  function resetPageNumber() {
    setPageNumber(0);
  }

  return {
    resetPageNumber,
    pageSize,
    page: pageNumber,
    getPaginationProps: (params) => ({
      onPageSizeChange(_event: unknown, value: string | null) {
        startTransition(() => {
          setPageSize(isNonNull(value) ? parseInt(value) : DEFAULT_PAGE_SIZE);
          setPageNumber(0);
        });
      },
      onPageChange(value: number) {
        startTransition(() => {
          setPageNumber(value);
        });
      },
      pageSize,
      pageNumber,
      pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
      alwaysShowPageSizeSelect: false,
      totalCount: params.totalCount,
    }),
  };
}
