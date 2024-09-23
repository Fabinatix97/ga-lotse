/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useCallback } from "react";

import { useServiceWorker } from "@/lib/businessModules/inspection/shared/offline/ServiceWorkerProvider";
import {
  PRE_CACHE_FOR_OFFLINE_MODE,
  X_ESHG_INSPECTION_ID,
} from "@/serviceWorker/common/common";

function getEmpty() {
  return {};
}

export function useGetHeadersForOfflineCaching(): (
  inspectionId?: string,
) => RequestInit {
  const { desiredPrecachedInspectionIds } = useServiceWorker();
  const getPreCacheForOfflineModeHeaders = useCallback(
    (inspectionId?: string) => {
      return {
        headers: {
          "Cache-Control": PRE_CACHE_FOR_OFFLINE_MODE,
          [X_ESHG_INSPECTION_ID]: inspectionId ?? "",
        },
      };
    },
    [],
  );
  return desiredPrecachedInspectionIds.length
    ? getPreCacheForOfflineModeHeaders
    : getEmpty;
}
