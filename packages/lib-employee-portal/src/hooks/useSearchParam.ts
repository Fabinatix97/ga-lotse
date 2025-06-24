/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ReadonlyURLSearchParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

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
    value = (value !== undefined) as NonNullable<BooleanNumberStringType<K>>;
  }
  const setValue = useCallback(
    (newValue: BooleanNumberStringType<K>) => setArrayParam([newValue]),
    [setArrayParam],
  );
  return [(value ?? null) as BooleanNumberStringType<K>, setValue];
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

function useSearchParamArray<K extends BooleanNumberStringNames>(
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
      const searchParams = windowSearchParams();
      const actualValues = values
        .filter((t) => t !== false && t !== null)
        .map((t) => `${t}`);
      const newSearch = updateSearchParam(param, actualValues, searchParams);
      setWindowSearchParams(pathname, newSearch, pushState);
    },
    [param, pathname, pushState],
  );

  const rawValues = searchParams.getAll(param);
  if (castTo === "boolean") {
    return [
      rawValues.map(
        (rawValue) =>
          (rawValue !== "false") as NonNullable<BooleanNumberStringType<K>>,
      ),
      setParam,
    ];
  }
  if (castTo === "number") {
    return [
      rawValues.map((rawValue) => {
        const int = rawValue !== null ? parseInt(rawValue, 10) : null;
        return int as NonNullable<BooleanNumberStringType<K>>;
      }),
      setParam,
    ];
  }
  return [rawValues as NonNullable<BooleanNumberStringType<K>>[], setParam];
}

export function useManySearchParams<T extends string>(paramNames: T[]) {
  const path = usePathname();
  const setFunction = useCallback(
    (givenNewValues: Record<T, string | undefined> | undefined) => {
      const params = windowSearchParams();
      const newValues =
        givenNewValues ?? ({} as Partial<Record<T, string | undefined>>);
      const newParams = paramNames.reduce((newParams, paramName) => {
        const value: string | undefined = newValues[paramName];
        return updateSearchParam(paramName, value ? [value] : [], newParams);
      }, params);
      setWindowSearchParams(path, newParams, false);
    },
    [paramNames, path],
  );
  const searchParams = useMemo(() => {
    const params = windowSearchParams();
    return paramNames.reduce((current, name) => {
      const newValue = params.get(name);
      if (newValue === null) {
        return current;
      }
      return { ...current, [name]: newValue };
    }, {}) as Partial<Record<T, string>>;
  }, [paramNames]);
  return [searchParams, setFunction] as const;
}

export function windowSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}
