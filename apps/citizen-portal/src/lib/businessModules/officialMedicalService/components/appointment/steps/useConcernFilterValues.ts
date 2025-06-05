/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSearchParams } from "next/navigation";

interface ConcernFilterValues {
  category?: string;
}

export function useConcernFilterValues(): ConcernFilterValues {
  const searchParams = useSearchParams();

  return {
    [SEARCH_PARAMS.category]:
      searchParams.get(SEARCH_PARAMS.category) ?? undefined,
  };
}

export const SEARCH_PARAMS = {
  category: "category",
} as const;
