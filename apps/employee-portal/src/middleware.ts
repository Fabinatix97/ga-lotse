/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NextRequest, NextResponse } from "next/server";

import {
  contentSecurityPolicyHeaderMiddleware,
  redirectToPublicUrlMiddleware,
} from "@eshg/lib-portal/server";

import { env } from "@/env/server";

export function middleware(request: NextRequest) {
  const redirect = redirectToPublicUrlMiddleware({
    internalPort: env.PORT,
    publicUrl: env.PUBLIC_FRONTEND_URL,
  })(request);
  if (redirect !== undefined) {
    return redirect;
  }

  const { addCspAndNonceRequestHeaders, addCspResponseHeader } =
    contentSecurityPolicyHeaderMiddleware(
      request.nextUrl,
      env.PUBLIC_FRONTEND_URL,
      {
        scriptSrcFallback: false,
        developmentMode: env.NODE_ENV === "development",
      },
    );
  addCspAndNonceRequestHeaders(request);

  const response = NextResponse.next({ request });

  addCspResponseHeader(response);

  return response;
}
