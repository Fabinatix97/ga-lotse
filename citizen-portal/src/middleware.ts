/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { contentSecurityPolicyHeaderMiddleware } from "@eshg/lib-portal/next/contentSecurityPolicyHeaderMiddleware";
import { redirectToPublicUrlMiddleware } from "@eshg/lib-portal/next/redirectToPublicUrlMiddleware";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/env/server";

import { redirectToLocaleMiddleware } from "./lib/i18n/redirectToLocaleMiddleware";

export function middleware(request: NextRequest) {
  let response: NextResponse | undefined;

  response = redirectToPublicUrlMiddleware({
    internalPort: env.PORT,
    publicUrl: env.PUBLIC_FRONTEND_URL,
  })(request);
  if (response !== undefined) {
    return response;
  }

  const { addCspAndNonceRequestHeaders, addCspResponseHeader } =
    contentSecurityPolicyHeaderMiddleware(
      request.nextUrl,
      env.PUBLIC_FRONTEND_URL,
      {
        scriptSrcFallback: true,
        developmentMode: env.NODE_ENV === "development",
      },
    );
  addCspAndNonceRequestHeaders(request);

  response = redirectToLocaleMiddleware({
    publicUrl: env.PUBLIC_FRONTEND_URL,
  })(request);

  if (response === undefined) {
    response = NextResponse.next({ request });
  }

  addCspResponseHeader(response);

  return response;
}
