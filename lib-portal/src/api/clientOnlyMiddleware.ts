/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Middleware } from "@eshg/employee-portal-api/base";
import { BailoutToCSRError } from "next/dist/shared/lib/lazy-dynamic/bailout-to-csr";

/**
 * Requests to the backend will only succeed on the client side.
 * During server-side rendering, we do not want to make requests to the backend because they will always fail.
 * Instead, we exit server-side rendering by throwing an error.
 * React will fall back to the Suspense boundary and stop rendering on the server side.
 *
 * See: https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content
 */
export const clientOnlyMiddleware = {
  async pre() {
    if (typeof window === "undefined") {
      // To prevent this artificial error from appearing in the browser console, we use a special Next.js error type: `BailoutToCSRError`.
      // This error type is filtered out by Next.js during hydration (see `onRecoverableError` in React docs and Next.js implementation).
      throw new BailoutToCSRError(
        "Skipped client-only request on server. This error can be ignored.",
      );
    }
    return Promise.resolve();
  },
} satisfies Middleware;
