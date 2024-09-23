/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";

import { SupportedLanguage, defaultLang, options } from "./options";
import { parseLocaleFromPath } from "./parseLocaleFromPath";

function isResource(url: URL) {
  return (
    url.pathname.startsWith("_next") ||
    url.pathname.startsWith("/api") ||
    /.*\.(.+)$/.test(url.pathname)
  );
}

const locales = [...options.supportedLngs];
function selectSupportedLang(
  headers: NextRequest["headers"],
): SupportedLanguage {
  const languages = new Negotiator({
    headers: Object.fromEntries(headers.entries()),
  }).language(locales);

  return (languages as SupportedLanguage) ?? defaultLang;
}

export function redirectToLocaleMiddleware({
  publicUrl,
}: {
  publicUrl: string;
}) {
  return function middleware(
    request: NextRequest,
  ): NextResponse<unknown> | undefined {
    const url = request.nextUrl;

    if (isResource(url)) {
      return;
    }

    const foundLocale = parseLocaleFromPath(url.pathname);

    if (foundLocale) {
      return;
    }

    const newLocale = selectSupportedLang(request.headers);
    const newURL = new URL(`/${newLocale}${url.pathname}${url.search}`, url);

    const responseHeaders = new Headers();
    const canonicalURL = new URL(
      `${newURL.pathname}${newURL.search}`,
      publicUrl,
    );

    // The template can use this header to set the canonical <link>
    responseHeaders.append("x-canonical-url", canonicalURL.toString());
    const headerLink = `<${encodeURI(canonicalURL.toString())}>; rel="canonical"`;
    responseHeaders.append("Link", headerLink);

    return NextResponse.rewrite(newURL, { headers: responseHeaders, request });
  };
}
