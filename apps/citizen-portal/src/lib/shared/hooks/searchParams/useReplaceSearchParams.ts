/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { isNonNullish } from "remeda";

import { ensureArray } from "@eshg/lib-portal";

import { useScopedRouter } from "@/lib/shared/components/scopedLinks";

type SearchParamValue =
  | string
  | number
  | string[]
  | number[]
  | null
  | undefined;

export interface SearchParamReplacement {
  name: string;
  value: SearchParamValue;
}

export function useReplaceSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useScopedRouter();

  function replaceSearchParams(
    searchParamReplacements: SearchParamReplacement[],
  ) {
    const newSearchParams = new URLSearchParams(searchParams);
    searchParamReplacements.forEach((replacement) => {
      newSearchParams.delete(replacement.name);
      if (isNonNullish(replacement.value)) {
        const values = ensureArray(replacement.value);
        values.forEach((value) => {
          const stringValue = String(value).trim();
          if (stringValue.length > 0) {
            newSearchParams.append(replacement.name, stringValue);
          }
        });
      }
    });
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }

  return useCallback(replaceSearchParams, [searchParams, pathname, router]);
}
