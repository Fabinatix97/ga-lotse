/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ColumnSort, SortingState } from "@tanstack/react-table";
import { startTransition, useState } from "react";
import { isDefined, last } from "remeda";

import { ApiSortDirection } from "@eshg/base-api";

import { ManualTableSortingProps } from "../types/tableSorting";

interface UseTableSorting {
  sortKey: string | undefined;
  sortDirection: ApiSortDirection | undefined;
  manualSortingProps: ManualTableSortingProps;
}

export function useTableSorting(params: {
  onSortingChange: () => void;
  initialSorting?: ColumnSort;
}): UseTableSorting {
  const [columnSort, setColumnSort] = useState<ColumnSort | undefined>(
    params.initialSorting,
  );

  return {
    sortKey: columnSort?.id,
    sortDirection: isDefined(columnSort)
      ? columnSort.desc
        ? "DESC"
        : "ASC"
      : undefined,
    manualSortingProps: {
      manualSorting: true,
      onSortingChange: (state?: SortingState) => {
        startTransition(() => {
          setColumnSort(isDefined(state) ? last(state) : undefined);
          params.onSortingChange();
        });
      },
      sortingState: isDefined(columnSort) ? [columnSort] : [],
    },
  };
}
