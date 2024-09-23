/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Middleware } from "@eshg/employee-portal-api/base";

export const clientOnlyMiddleware = {
  async pre() {
    if (typeof window === "undefined") {
      throw new Error(
        "Skipped client-only request on server. This error can be ignored.",
      );
    }
    return Promise.resolve();
  },
} satisfies Middleware;
