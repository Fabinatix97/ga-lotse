/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isString } from "remeda";
import { v4 as uuidv4 } from "uuid";

interface ContentSecurityPolicyHeaderMiddlewareOptions {
  /**
   * Add fallbacks to support old browser versions.
   * See: https://web.dev/articles/strict-csp#fallbacks
   */
  scriptSrcFallback: boolean;
  /**
   * Insecure if set to true! Unfortunately, a strict CSP header conflicts with dev-mode mechanisms.
   * So we cannot use nonce-based CSP in dev mode. We also need to allow eval calls.
   *
   * Based on official Next.js example: https://github.com/vercel/next.js/blob/canary/examples/with-strict-csp/middleware.js
   */
  developmentMode: boolean;
  /**
   * Insecure if set to false!
   * Safari / WebKit has no special treatment for http://localhost specially (like other browsers do).
   * For this reason, Safari will not work when browsing the page on localhost without TLS if the `upgrade-insecure-requests` directive is included.
   *
   * See https://bugs.webkit.org/show_bug.cgi?id=250776
   */
  upgradeInsecureRequests: boolean;
}

function joinSourceValues(...values: (string | false)[]) {
  return values.filter(isString).join(" ");
}

export function buildContentSecurityPolicyHeaderValue(
  options: {
    nonce: string;
  } & ContentSecurityPolicyHeaderMiddlewareOptions,
) {
  const scriptSrc = joinSourceValues(
    !options.developmentMode &&
      `'nonce-${options.nonce}' 'strict-dynamic' 'wasm-unsafe-eval'`,
    options.developmentMode && "'unsafe-eval'",
    (options.scriptSrcFallback || options.developmentMode) &&
      "https: http: 'unsafe-inline'",
  );

  const styleSrcElem = joinSourceValues(
    "'self'",
    options.developmentMode ? "'unsafe-inline'" : `'nonce-${options.nonce}'`,
  );

  const cspHeader = [
    `default-src 'self'`,
    `connect-src 'self'`,
    `script-src ${scriptSrc}`,
    `style-src-elem ${styleSrcElem}`,
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    options.upgradeInsecureRequests && `upgrade-insecure-requests`,
  ]
    .filter(isString)
    .join("; ");

  return cspHeader;
}

function generateNonceAndHeaderValue(
  options: ContentSecurityPolicyHeaderMiddlewareOptions,
) {
  const nonce = Buffer.from(uuidv4()).toString("base64");

  return {
    nonce,
    contentSecurityPolicyHeaderValue: buildContentSecurityPolicyHeaderValue({
      nonce,
      ...options,
    }),
  };
}

function isInsecureLocalhost(publicUrl: string) {
  const url = new URL(publicUrl);
  return url.hostname === "localhost" && url.protocol === "http:";
}

/**
 * Middleware that generates a nonce and sets the Content Security Policy (CSP) header on the resonse.
 * The nonce and CSP header are also made available for server componts by attaching them as a http header in the request.
 * Adapted from https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy
 */
export function contentSecurityPolicyHeaderMiddleware(
  requestUrl: URL,
  publicUrl: string,
  options: Omit<
    ContentSecurityPolicyHeaderMiddlewareOptions,
    "upgradeInsecureRequests"
  >,
) {
  // Match all request paths except for the ones starting with:
  // - /_next/static (static files)
  const shouldAddHeader = /^\/(?!_next\/static).*/.test(requestUrl.pathname);

  const upgradeInsecureRequests = !isInsecureLocalhost(publicUrl);

  const runtime = shouldAddHeader
    ? {
        shouldAddHeader,
        ...generateNonceAndHeaderValue({
          ...options,
          upgradeInsecureRequests,
        }),
      }
    : { shouldAddHeader };

  return {
    addCspAndNonceRequestHeaders(request: NextRequest) {
      if (!runtime.shouldAddHeader) {
        return;
      }

      // Enable Next.js and Server Components to use the generated nonce
      // by passing the nonce and the CSP header in the request.
      request.headers.set("x-nonce", runtime.nonce);
      request.headers.set(
        "Content-Security-Policy",
        runtime.contentSecurityPolicyHeaderValue,
      );
    },
    addCspResponseHeader(response: NextResponse) {
      if (!runtime.shouldAddHeader) {
        return;
      }

      // Set the CSP header in the response for the browser to see it.
      response.headers.set(
        "Content-Security-Policy",
        runtime.contentSecurityPolicyHeaderValue,
      );
    },
  };
}

export function getNonceFromHeader() {
  return headers().get("x-nonce") ?? undefined;
}
