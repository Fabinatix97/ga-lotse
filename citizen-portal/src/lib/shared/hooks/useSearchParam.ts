/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type BooleanNumberStringNames = "boolean" | "number" | "string";
type BooleanNumberStringType<K> = K extends "boolean"
  ? boolean
  : K extends "number"
    ? number
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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (value: BooleanNumberStringType<K>) => {
      const newSearch = new URLSearchParams(Array.from(searchParams));

      if (value == null || value === false) {
        newSearch.delete(param);
      } else {
        newSearch.set(param, `${value}`);
      }
      const paramsString = newSearch.toString();
      const query = paramsString && `?${paramsString}`;
      if (pushState) {
        window.history.pushState(null, "", `${pathname}${query}`);
      } else {
        window.history.replaceState(null, "", `${pathname}${query}`);
      }
    },
    [param, pathname, pushState, searchParams],
  );

  const rawValue = searchParams.get(param);
  if (castTo === "boolean") {
    return [(rawValue === "true") as BooleanNumberStringType<K>, setParam];
  }
  if (castTo === "number") {
    const int = rawValue != null ? parseInt(rawValue, 10) : 0;
    return [int as BooleanNumberStringType<K>, setParam];
  }
  return [rawValue as BooleanNumberStringType<K>, setParam];
}
