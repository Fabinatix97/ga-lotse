/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CacheWillUpdateCallbackParam, WorkboxPlugin } from "workbox-core";

import {
  PRE_CACHE_FOR_OFFLINE_MODE,
  X_ESHG_INSPECTION_ID,
} from "@/serviceWorker/common/common";
import { precachedInspectionIds } from "@/serviceWorker/common/precachedInspectionIds";

// Only cache responses that
// - HTTP 2xx
// - the request Cache-Control header holds the (non-standard) value "pre-cache-for-offline-mode"
// - the request x-eshg-inspection-id header is
//   - empty and precachedInspectionIds is non-empty
//   - an id contained in precachedInspectionIds.
// By manually setting the Cache-Control header accordingly only for requests we do want to cache we prevent cache-pollution.
export class CacheableResponsePlugin implements WorkboxPlugin {
  async cacheWillUpdate({
    request,
    response,
  }: CacheWillUpdateCallbackParam): Promise<
    Response | void | null | undefined
  > {
    const inspectionId = request.headers
      .get(X_ESHG_INSPECTION_ID)
      ?.toLowerCase();
    const cacheDirectives = request.headers
      .get("cache-control")
      ?.split(",")
      .map((s) => s.trim().toLowerCase());
    const shouldPrecache =
      response.ok &&
      cacheDirectives?.includes(PRE_CACHE_FOR_OFFLINE_MODE) &&
      (inspectionId
        ? await precachedInspectionIds.has(inspectionId)
        : await precachedInspectionIds.size());
    return Promise.resolve(shouldPrecache ? response : null);
  }
}
