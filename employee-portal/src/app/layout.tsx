/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProvider } from "@eshg/lib-portal/api/ApiProvider";
import { NonceProvider } from "@eshg/lib-portal/components/NonceProvider";
import { SnackbarProvider } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { getNonceFromHeader } from "@eshg/lib-portal/next/contentSecurityPolicyHeaderMiddleware";
import { ReactNode } from "react";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { ThemeProvider } from "@/lib/baseModule/theme/ThemeProvider";
import { ChatProvider } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CHAT_CONFIGURATION } from "@/lib/businessModules/chat/shared/config";
import { ServiceWorkerProvider } from "@/lib/businessModules/inspection/shared/offline/ServiceWorkerProvider";
import { OfflinePasswordPrompt } from "@/lib/businessModules/inspection/shared/offline/password/OfflinePasswordPrompt";
import { API_CONFIGURATION } from "@/lib/shared/api/config";
import { EmployeeSnackbar } from "@/lib/shared/components/EmployeeSnackbar";
import { ConfirmNavigationProvider } from "@/lib/shared/components/confirmationDialog/ConfirmNavigationProvider";
import { ConfirmationDialogProvider } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";

// Opt out of the Data Cache and Full Route Cache. All routes are dynamically rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "GA-Lotse",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  const nonce = getNonceFromHeader();

  return (
    <html lang="de">
      <head>
        {/* manually specify icon so next.js won't add a cash-busting hash that would make pre-caching hard */}
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
      </head>
      <body
        style={{ backgroundColor: "var(--joy-palette-neutral-100, #F0F4F8)" }}
      >
        <NonceProvider initialNonce={nonce}>
          <ThemeProvider>
            <SnackbarProvider snackbar={EmployeeSnackbar}>
              <ConfirmationDialogProvider>
                <ConfirmNavigationProvider>
                  <ApiProvider configuration={API_CONFIGURATION}>
                    <OfflinePasswordPrompt />
                    <ServiceWorkerProvider>
                      <ChatProvider configuration={CHAT_CONFIGURATION}>
                        <MainLayout>{children}</MainLayout>
                      </ChatProvider>
                      {modal}
                    </ServiceWorkerProvider>
                  </ApiProvider>
                </ConfirmNavigationProvider>
              </ConfirmationDialogProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </NonceProvider>
      </body>
    </html>
  );
}
