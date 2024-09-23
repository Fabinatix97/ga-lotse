/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CacheWillUpdateCallbackParam,
  CachedResponseWillBeUsedCallbackParam,
  WorkboxPlugin,
} from "workbox-core";

import { decrypt, encrypt } from "@/serviceWorker/sw/crypto/crypto";

export class EncryptPlugin implements WorkboxPlugin {
  async cacheWillUpdate({
    response,
  }: CacheWillUpdateCallbackParam): Promise<Response> {
    return new Response(await encrypt(await response.arrayBuffer()), response);
  }

  async cachedResponseWillBeUsed({
    cachedResponse,
  }: CachedResponseWillBeUsedCallbackParam): Promise<Response | undefined> {
    if (!cachedResponse) return cachedResponse;
    return new Response(
      await decrypt(await cachedResponse.arrayBuffer()),
      cachedResponse,
    );
  }
}
