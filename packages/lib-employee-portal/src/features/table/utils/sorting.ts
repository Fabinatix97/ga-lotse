/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { isDefined } from "remeda";

import { ApiSortDirection } from "@eshg/base-api";

import { TableSortingProps } from "../types/tableSorting";

export function getSortKey<TSortKey extends string>(
  sortingProps: TableSortingProps,
  mapping?: Record<string, TSortKey>,
): TSortKey | undefined {
  const sorting = sortingProps.manualSorting
    ? sortingProps.sortingState
    : sortingProps.initialSorting;
  if (sorting?.[0] === undefined) return undefined;

  if (isDefined(mapping)) {
    return mapping[sorting[0].id];
  }

  return sorting[0].id.toUpperCase() as TSortKey;
}

export function getSortDirection(
  sortingProps: TableSortingProps,
): ApiSortDirection | undefined {
  const sorting = sortingProps.manualSorting
    ? sortingProps.sortingState
    : sortingProps.initialSorting;
  if (sorting?.[0] === undefined) return undefined;
  return sorting[0].desc ? ApiSortDirection.Desc : ApiSortDirection.Asc;
}
