/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CacheWillUpdateCallbackParam, WorkboxPlugin } from "workbox-core";

import { PRE_CACHE_FOR_OFFLINE_MODE } from "@/serviceWorker/common/common";

// Only cache HTTP 2xx responses for which the Cache-Control header holds the (non-standard) value "pre-cache-for-offline-mode".
// By manually setting the header accordingly only for requests we do want to cache we prevent cache-pollution.
export class CacheableResponsePlugin implements WorkboxPlugin {
  cacheWillUpdate({
    request,
    response,
  }: CacheWillUpdateCallbackParam): Promise<
    Response | void | null | undefined
  > {
    const cacheDirectives = request.headers
      .get("cache-control")
      ?.split(",")
      .map((s) => s.trim().toLowerCase());
    const shouldPrecache =
      response.ok && cacheDirectives?.includes(PRE_CACHE_FOR_OFFLINE_MODE);
    return Promise.resolve(shouldPrecache ? response : null);
  }
}
