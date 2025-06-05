/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CacheKeyWillBeUsedCallbackParam,
  RequestWillFetchCallbackParam,
  WorkboxPlugin,
} from "workbox-core";

// According to the response's vary-header Next.js RSCs depend on (among other request headers)
// * Next-Router-State-Tree
// * Next-Router-Prefetch
// The router state headers describe the current state, i.e. before navigation to the route of the RSC we try to load.
// This effectively means that for n routes we would have to pre-cash on the order of 2n² requests.
// Obviously this isn't feasible.
// If we remove the two aforementioned headers the next proxy server will respond with and RSC that is acceptable to the client in any state.
// Additionally, we have to remove the query parameter _rsc which holds a hash of all request headers included in the vary response header. (See https://github.com/vercel/next.js/discussions/59167 for rational)
// Note that all these headers and query parameters are implementation details of Next.js.
export class StripRscRequestPlugin implements WorkboxPlugin {
  cacheKeyWillBeUsed({
    request,
  }: CacheKeyWillBeUsedCallbackParam): Promise<Request | string> {
    return Promise.resolve(this.stripQueryString(request));
  }

  requestWillFetch({
    request,
  }: RequestWillFetchCallbackParam): Promise<Request> {
    return Promise.resolve(
      new Request(this.stripQueryString(request), {
        headers: this.stripNextRscHeaders(request),
      }),
    );
  }

  private stripQueryString(request: Request): string {
    const newUrl = new URL(request.url);
    newUrl.searchParams.delete("_rsc");
    return newUrl.href;
  }

  private stripNextRscHeaders(request: Request): Headers {
    const headers = new Headers(request.headers);
    headers.delete("Next-Router-Prefetch");
    headers.delete("Next-Router-State-Tree");
    return headers;
  }
}
