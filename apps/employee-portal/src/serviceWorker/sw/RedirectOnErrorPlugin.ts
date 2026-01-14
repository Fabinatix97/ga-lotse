/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HandlerDidErrorCallbackParam, WorkboxPlugin } from "workbox-core";

// Redirect to the given path if the requested page is neither available from the network nor the cache.
// Note that the advertised offline-fallback of next-pwa (https://ducanh-next-pwa.vercel.app/docs/next-pwa/offline-fallbacks#offline-fallbacks) doesn't work reliably, i.e. The app crashed on some uncashed routes.
export class RedirectOnErrorPlugin implements WorkboxPlugin {
  constructor(private path: string) {}

  handlerDidError({
    request,
  }: HandlerDidErrorCallbackParam): Promise<Response | undefined> {
    const url = new URL(request.url);
    if (url.pathname === this.path && !url.search) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(
      new Response(null, {
        status: 302,
        headers: { Location: this.path },
      }),
    );
  }
}
