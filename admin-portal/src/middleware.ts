/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { contentSecurityPolicyHeaderMiddleware } from "@eshg/lib-portal/next/contentSecurityPolicyHeaderMiddleware";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env/server";

export function middleware(request: NextRequest) {
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
