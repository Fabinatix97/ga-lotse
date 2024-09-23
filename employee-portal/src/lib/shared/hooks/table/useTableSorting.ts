/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiSortDirection } from "@eshg/employee-portal-api/base";
import { ColumnSort, SortingState } from "@tanstack/react-table";
import { startTransition, useState } from "react";
import { isDefined, last } from "remeda";

import { ManualSortingProps } from "@/lib/shared/components/table/DataTable";

interface UseTableSorting {
  sortKey: string | undefined;
  sortDirection: ApiSortDirection | undefined;
  manualSortingProps: ManualSortingProps;
}

export function useTableSorting(params: {
  onSortingChange: () => void;
}): UseTableSorting {
  const [columnSort, setColumnSort] = useState<ColumnSort>();

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
