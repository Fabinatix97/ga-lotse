/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export interface TablePageParamNames {
  sortFieldName: string;
  sortDirectionName: string;
  pageNumberName: string;
  pageSizeName: string;
}

export function useTablePageParams<ColumnName extends string = string>({
  fieldNames: givenNames = {},
  mapColumnNames,
}: {
  fieldNames?: Partial<TablePageParamNames>;
  mapColumnNames?: (t: ColumnName | undefined) => string | undefined;
} = {}) {
  const fieldNames: TablePageParamNames = {
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
    pageNumberName: "pageNumber",
    pageSizeName: "pageSize",
    ...givenNames,
  };

  const searchParams = useSearchParams();
  const pageNumberNaN = parseInt(
    searchParams.get(fieldNames.pageNumberName) ?? "",
  );
  const pageNumber = isNaN(pageNumberNaN) ? undefined : pageNumberNaN;

  const pageSizeNaN = parseInt(searchParams.get(fieldNames.pageSizeName) ?? "");
  const pageSize = isNaN(pageSizeNaN) ? undefined : pageSizeNaN;

  const sortKeyUnmapped = (searchParams.get(fieldNames.sortFieldName) ??
    undefined) as ColumnName | undefined;

  const sortDirection = (
    searchParams.get(fieldNames.sortDirectionName) ?? undefined
  )?.toUpperCase();

  const sortKey = mapColumnNames
    ? mapColumnNames(sortKeyUnmapped)
    : sortKeyUnmapped;

  const tableParams = useMemo(
    () => ({
      pageNumber,
      pageSize,
      sortBy: sortKey,
      sortOrder: sortDirection,
    }),
    [pageNumber, pageSize, sortKey, sortDirection],
  );
  return tableParams;
}
