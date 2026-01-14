/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { buildRouteWithParams } from "@/lib/shared/components/procedures/helper";

export function useBuildRoutePreservingSearchParams() {
  const searchParams = useSearchParams();
  return useCallback(
    (route: string) => {
      return buildRouteWithParams(route, searchParams);
    },
    [searchParams],
  );
}
