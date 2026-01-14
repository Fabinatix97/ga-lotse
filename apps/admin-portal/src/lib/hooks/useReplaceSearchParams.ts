/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { isNonNullish } from "remeda";

import { ensureArray } from "@eshg/lib-portal";

import { canonicalColumnId } from "@/lib/hooks/useEntities";

type SearchParamValue =
  | string
  | number
  | string[]
  | number[]
  | null
  | undefined;

interface SearchParamReplacement {
  name: string;
  value: SearchParamValue;
}

export function useReplaceSearchParams() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function replaceSearchParams(
    searchParamReplacements: SearchParamReplacement[],
  ) {
    const newSearchParams = new URLSearchParams(searchParams);
    searchParamReplacements.forEach((replacement) => {
      newSearchParams.delete(canonicalColumnId(replacement.name));
      if (isNonNullish(replacement.value)) {
        const values = ensureArray(replacement.value);
        values.forEach((value) => {
          const stringValue = String(value).trim();
          if (stringValue.length > 0) {
            newSearchParams.append(
              canonicalColumnId(replacement.name),
              stringValue,
            );
          }
        });
      }
    });
    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }

  return useCallback(replaceSearchParams, [searchParams, pathname, router]);
}
