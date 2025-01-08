/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { startTransition, useState } from "react";
import { isNonNull } from "remeda";

import { PaginationProps } from "@/lib/shared/components/pagination/Pagination";
import {
  defaultPageSize,
  defaultPageSizeOptions,
} from "@/lib/shared/components/pagination/paginationHelper";

interface UsePagination {
  resetPageNumber: () => void;
  page: number;
  pageSize: number;
  getPaginationProps: (params: { totalCount: number }) => PaginationProps;
}

export function usePagination(): UsePagination {
  const [pageSize, setPageSize] = useState(defaultPageSize);
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
          setPageSize(isNonNull(value) ? parseInt(value) : defaultPageSize);
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
      pageSizeOptions: defaultPageSizeOptions,
      alwaysShowPageSizeSelect: false,
      totalCount: params.totalCount,
    }),
  };
}
