/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useRef, useState } from "react";
import { isDeepEqual, isDefined, isNonNullish } from "remeda";

import { routes as inspectionRoutes } from "@/lib/businessModules/inspection/shared/routes";
import { PAGES_CACHE_NAME, uuidV4Re } from "@/serviceWorker/common/common";

const basedataRegex = new RegExp(
  inspectionRoutes.procedures.basedata(`(?<inspectionId>${uuidV4Re})`) + "$",
  "i",
);

export function getInspectionIdsOfProcedureBaseDataRequests(
  requests: readonly Request[],
): string[] {
  return requests
    .map((r) => basedataRegex.exec(r.url)?.groups?.inspectionId)
    .filter(isNonNullish)
    .sort((a, b) => a.localeCompare(b));
}

// periodically check the cache for precached inspection details routes
export function useGetPrecachedInspections() {
  const [inspectionIds, setInspectionIds] = useState<string[]>([]);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    async function queryCache() {
      try {
        const serviceWorker = await window.workbox?.controlling;
        if (isNonNullish(serviceWorker)) {
          const cache = await caches.open(PAGES_CACHE_NAME);
          const cachedPageRequests = await cache.keys();
          const inspectionIds =
            getInspectionIdsOfProcedureBaseDataRequests(cachedPageRequests);
          setInspectionIds((old) =>
            old && isDeepEqual(inspectionIds, old) ? old : inspectionIds,
          );
        }
      } finally {
        timeoutId.current = setTimeout(() => void queryCache(), 5_000);
      }
    }

    void queryCache();

    return () => {
      if (isDefined(timeoutId.current)) clearTimeout(timeoutId.current);
    };
  }, []);

  return inspectionIds;
}
