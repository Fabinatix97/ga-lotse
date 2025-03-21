/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EnvironmentTypeProvider } from "@eshg/lib-portal/components/EnvironmentTypeProvider";
import { NonceProvider } from "@eshg/lib-portal/components/NonceProvider";
import { getNonceFromHeader } from "@eshg/lib-portal/next/contentSecurityPolicyHeaderMiddleware";
import { LayoutProps } from "@eshg/lib-portal/types/pageParams";
import { Box } from "@mui/joy";
import type { Metadata } from "next";

import { env } from "@/env/server";
import { ApiProvider } from "@/lib/components/layout/ApiProvider";
import { MainLayoutWithProviders } from "@/lib/components/layout/MainLayout";
import { ThemeProvider } from "@/lib/components/layout/theme/ThemeProvider";

// Opt out of the Data Cache and Full Route Cache. All routes are dynamically rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin-Portal",
};

export default async function RootLayout(props: LayoutProps) {
  const nonce = await getNonceFromHeader();

  return (
    <html>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <NonceProvider initialNonce={nonce}>
        <ThemeProvider>
          <Box component="body" sx={{ backgroundColor: "neutral.100" }}>
            <noscript>
              Bitte aktivieren Sie JavaScript, um diese Anwendung zu nutzen.
            </noscript>
            <ApiProvider>
              <EnvironmentTypeProvider
                environmentType={env.PUBLIC_ENVIRONMENT_TYPE}
              >
                <MainLayoutWithProviders>
                  {props.children}
                </MainLayoutWithProviders>
              </EnvironmentTypeProvider>
            </ApiProvider>
          </Box>
        </ThemeProvider>
      </NonceProvider>
    </html>
  );
}
