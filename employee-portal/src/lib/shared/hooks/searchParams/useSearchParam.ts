/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

type BooleanNumberStringNames = "boolean" | "number" | "string";
type BooleanNumberStringType<K> = K extends "boolean"
  ? boolean
  : K extends "number"
    ? number | null
    : K extends "string"
      ? string | null
      : never;

interface UseSearchParamOptions {
  pushState?: boolean;
}

export function useSearchParam<K extends BooleanNumberStringNames>(
  param: string,
  castTo?: K,
  { pushState = false }: UseSearchParamOptions = {},
): [BooleanNumberStringType<K>, (v: BooleanNumberStringType<K>) => void] {
  const [arrayParam, setArrayParam] = useSearchParamArray<K>(param, castTo, {
    pushState,
  });
  let value = arrayParam[0];
  if (castTo === "boolean") {
    value = !!value as NonNullable<BooleanNumberStringType<K>>;
  }
  return [
    (value ?? null) as BooleanNumberStringType<K>,
    (value) => setArrayParam([value]),
  ];
}

export function updateSearchParam(
  param: string,
  actualValues: string[],
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): URLSearchParams {
  const newSearch = new URLSearchParams(Array.from(searchParams));
  newSearch.delete(param);
  for (const value of actualValues) {
    newSearch.append(param, value);
  }

  return newSearch;
}

export function setWindowSearchParams(
  pathname: string,
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
  pushState: boolean,
) {
  const paramsString = searchParams.toString();
  const query = paramsString && `?${paramsString}`;
  if (pushState) {
    window.history.pushState(null, "", `${pathname}${query}`);
  } else {
    window.history.replaceState(null, "", `${pathname}${query}`);
  }
}

export function useSearchParamLink(
  searchParam: string,
  value: boolean | string | number,
) {
  const searchParams = useSearchParams();
  const newSearch = new URLSearchParams(Array.from(searchParams));
  newSearch.set(searchParam, value.toString());
  return `?${newSearch.toString()}`;
}

export function useSearchParamArray<K extends BooleanNumberStringNames>(
  param: string,
  castTo?: K,
  { pushState = false }: UseSearchParamOptions = {},
): [
  NonNullable<BooleanNumberStringType<K>>[],
  (v: BooleanNumberStringType<K>[]) => void,
] {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (values: BooleanNumberStringType<K>[]) => {
      const actualValues = values
        .filter((t) => t !== false && t !== null)
        .map((t) => `${t}`);
      const newSearch = updateSearchParam(param, actualValues, searchParams);
      setWindowSearchParams(pathname, newSearch, pushState);
    },
    [param, pathname, pushState, searchParams],
  );

  const rawValues = searchParams.getAll(param);
  if (castTo === "boolean") {
    return [
      rawValues.map(
        (rawValue) =>
          (rawValue === "true") as NonNullable<BooleanNumberStringType<K>>,
      ),
      setParam,
    ];
  }
  if (castTo === "number") {
    return [
      rawValues.map((rawValue) => {
        const int = rawValue != null ? parseInt(rawValue, 10) : null;
        return int as NonNullable<BooleanNumberStringType<K>>;
      }),
      setParam,
    ];
  }
  return [rawValues as NonNullable<BooleanNumberStringType<K>>[], setParam];
}
