/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Middleware } from "@eshg/base-api";

export function acceptLanguageMiddleware(acceptLanguage: string): Middleware {
  return {
    pre(context) {
      return Promise.resolve({
        url: context.url,
        init: {
          ...context.init,
          headers: {
            ...context.init.headers,
            "Accept-Language": acceptLanguage,
          },
        },
      });
    },
  };
}
