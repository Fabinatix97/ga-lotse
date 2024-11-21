/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint @next/next/no-head-element: 0 */
import { ApiProvider } from "@eshg/lib-portal/api/ApiProvider";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { SnackbarProvider } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { PropsWithChildren } from "react";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { ThemeProvider } from "@/lib/baseModule/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { API_CONFIGURATION } from "@/lib/shared/api/config";
import { CitizenSnackbar } from "@/lib/shared/components/CitizenSnackbar";
import { NavigationProvider } from "@/lib/shared/components/navigationProvider/NavigationProvider";

export function AppLayout({
  lang,
  children,
}: Readonly<
  PropsWithChildren<{
    lang: string;
  }>
>) {
  return (
    <html lang={lang} style={{ height: "100%" }}>
      <body
        style={{
          backgroundColor: "var(--joy-palette-neutral-100, #F0F4F8)",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <noscript>
          Bitte aktivieren Sie JavaScript, um diese Anwendung zu nutzen.
        </noscript>
        <I18nProvider lang={lang}>
          <ThemeProvider>
            <SnackbarProvider snackbar={CitizenSnackbar}>
              <NavigationProvider>
                <ApiProvider configuration={API_CONFIGURATION}>
                  <QueryBoundary>
                    <MainLayout>{children}</MainLayout>
                  </QueryBoundary>
                </ApiProvider>
              </NavigationProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
