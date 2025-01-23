/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NonceProvider } from "@eshg/lib-portal/components/NonceProvider";
import { getNonceFromHeader } from "@eshg/lib-portal/next/contentSecurityPolicyHeaderMiddleware";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";

import { baseTranslations } from "@/lib/baseModule/locales";

// Opt out of the Data Cache and Full Route Cache. All routes are dynamically rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Layout({
  params: _params,
  children,
}: Readonly<{
  params: unknown;
  children: ReactNode;
}>) {
  const nonce = getNonceFromHeader();
  return <NonceProvider initialNonce={nonce}>{children}</NonceProvider>;
}

export function generateMetadata(
  _args: { params: unknown },
  _parent: ResolvingMetadata,
): Metadata {
  const canonicalURL = headers().get("x-canonical-url");
  if (!canonicalURL) {
    return {};
  }
  return {
    title: baseTranslations.de.site_title,
    description: baseTranslations.de.site_description,
    keywords: baseTranslations.de.site_keywords,
    alternates: { canonical: canonicalURL },
  };
}
