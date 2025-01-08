/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiSortDirection } from "@eshg/employee-portal-api/base";
import { ReadonlyURLSearchParams } from "next/navigation";
import { isDefined, isString } from "remeda";

import { safeIntOrUndefined } from "@/lib/shared/helpers/numbers";

export interface PaginatedSearchParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface SortableSearchParams<TKey> {
  sortKey?: TKey;
  sortDirection?: ApiSortDirection;
}

export type SearchParamValue = string | string[] | undefined | null;
export type SearchParams = Record<string, SearchParamValue>;

export function parseOptionalEnum<E, T extends Record<string, E>>(
  enumRecord: T,
  value: SearchParamValue,
): E | undefined {
  return isString(value)
    ? Object.values(enumRecord).find(
        (enumValue) => value.toUpperCase() === enumValue,
      )
    : undefined;
}

export function parseOptionalInt(value: SearchParamValue): number | undefined {
  if (!isString(value)) return undefined;
  const number = parseInt(value);
  return String(number) === value ? safeIntOrUndefined(number) : undefined;
}

export function parseOptionalBoundedInt(
  value: SearchParamValue,
  min: number,
  max: number = Number.MAX_SAFE_INTEGER,
): number | undefined {
  const num = parseOptionalInt(value);
  return isDefined(num) && num >= min && num <= max ? num : undefined;
}

export function parseOptionalNonNegativeInt(
  value: SearchParamValue,
): number | undefined {
  return parseOptionalBoundedInt(value, 0);
}

export function parseOptionalPositiveInt(
  value: SearchParamValue,
): number | undefined {
  return parseOptionalBoundedInt(value, 1);
}

export function parseOptionalString(
  value: SearchParamValue,
): string | undefined {
  return isString(value) && value.trim().length > 0 ? value.trim() : undefined;
}

export function parsePageParams(params: SearchParams) {
  return {
    pageNumber: parseOptionalNonNegativeInt(params.pageNumber),
    pageSize: parseOptionalBoundedInt(params.pageSize, 1, 50),
  };
}

export function parseReadonlyPageParams(params: ReadonlyURLSearchParams) {
  return {
    pageNumber: parseOptionalNonNegativeInt(params.get("pageNumber")),
    pageSize: parseOptionalBoundedInt(params.get("pageSize"), 1, 50),
  };
}
