/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { MetadataRoute } from "next";

import { env } from "@/env/server";

export const dynamic = "force-dynamic";
export default function robots(): MetadataRoute.Robots {
  if (env.PUBLIC_DEPLOYMENT_TYPE === "test") {
    return {
      rules: {
        userAgent: "*",
        disallow: "/", // Disallow everything
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
