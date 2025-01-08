/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiSortDirection } from "@eshg/employee-portal-api/base";

import { CustomSortingProps } from "@/lib/shared/hooks/searchParams/useTableControl";

export function getSortKey<TSortKey extends string>(
  sortingProps: CustomSortingProps,
): TSortKey | undefined {
  const sorting = sortingProps.manualSorting
    ? sortingProps.sortingState
    : sortingProps.initialSorting;
  if (sorting?.[0] === undefined) return undefined;
  return sorting[0].id.toUpperCase() as TSortKey;
}

export function getSortKeyWithSpecificMapping<TSortKey extends string>(
  sortingProps: CustomSortingProps,
  mapping: Record<string, TSortKey>,
): TSortKey | undefined {
  const sorting = sortingProps.manualSorting
    ? sortingProps.sortingState
    : sortingProps.initialSorting;
  if (sorting?.[0] === undefined) return undefined;
  return mapping[sorting[0].id];
}

export function getSortDirection(
  sortingProps: CustomSortingProps,
): ApiSortDirection | undefined {
  const sorting = sortingProps.manualSorting
    ? sortingProps.sortingState
    : sortingProps.initialSorting;
  if (sorting?.[0] === undefined) return undefined;
  return sorting[0].desc ? ApiSortDirection.Desc : ApiSortDirection.Asc;
}
