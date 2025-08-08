/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";

import { LayoutProps, NonceProvider } from "@eshg/lib-portal";
import { getNonceFromHeader } from "@eshg/lib-portal/server";

import { baseTranslations } from "@/lib/baseModule/locales";

// Opt out of the Data Cache and Full Route Cache. All routes are dynamically rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Layout(props: LayoutProps) {
  const nonce = await getNonceFromHeader();
  return <NonceProvider initialNonce={nonce}>{props.children}</NonceProvider>;
}

export async function generateMetadata(
  _args: { params: unknown },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const headersStore = await headers();
  const canonicalURL = headersStore.get("x-canonical-url");
  if (!canonicalURL) {
    return {};
  }
  return {
    description: baseTranslations.de.site_description,
    keywords: baseTranslations.de.site_keywords,
    alternates: { canonical: canonicalURL },
  };
}
