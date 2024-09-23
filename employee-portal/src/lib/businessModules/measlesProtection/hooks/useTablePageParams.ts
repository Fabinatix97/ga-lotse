/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useTablePageParams() {
  const searchParams = useSearchParams();

  const pageNumberNaN = parseInt(searchParams.get("pageNumber") ?? "");
  const pageNumber = isNaN(pageNumberNaN) ? undefined : pageNumberNaN;

  const pageSizeNaN = parseInt(searchParams.get("pageSize") ?? "");
  const pageSize = isNaN(pageSizeNaN) ? undefined : pageSizeNaN;

  const sortKey = searchParams.get("sortKey") ?? undefined;
  const sortDirection = searchParams.get("sortDirection") ?? undefined;
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
