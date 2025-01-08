/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextRequest, NextResponse } from "next/server";

interface RedirectToPublicUrlMiddlewareOptions {
  internalPort: string;
  publicUrl: string;
}

export function redirectToPublicUrlMiddleware(
  options: RedirectToPublicUrlMiddlewareOptions,
) {
  return function middleware(
    request: NextRequest,
  ): NextResponse<unknown> | undefined {
    const originalHost = request.headers.get("x-forwarded-host");
    if (originalHost === `localhost:${options.internalPort}`) {
      const url = new URL(request.url);
      return NextResponse.redirect(`${options.publicUrl}${url.pathname}`, 308);
    }
  };
}
