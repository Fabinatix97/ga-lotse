/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { ReactNode } from "react";

import {
  ConfirmationDialog,
  DrawerProvider,
  EmployeePortalErrorModal,
  EmployeePortalProvider,
} from "@eshg/lib-employee-portal";
import {
  ApiProvider,
  ConfirmationDialogProvider,
  EnvironmentTypeProvider,
  HiddenDownloadContainer,
  NonceProvider,
  QueryBoundary,
  SnackbarProvider,
} from "@eshg/lib-portal";
import { getNonceFromHeader } from "@eshg/lib-portal/server";

import { LAYOUT_CONFIG } from "@/config/layout";
import { env } from "@/env/server";
import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { ThemeProvider } from "@/lib/baseModule/theme/ThemeProvider";
import { ChatProvider } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CHAT_CONFIGURATION } from "@/lib/businessModules/chat/shared/config";
import { ServiceWorkerProvider } from "@/lib/businessModules/inspection/shared/offline/ServiceWorkerProvider";
import { OfflinePasswordPrompt } from "@/lib/businessModules/inspection/shared/offline/password/OfflinePasswordPrompt";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { API_CONFIGURATION } from "@/lib/shared/api/config";
import { EmployeeSnackbar } from "@/lib/shared/components/EmployeeSnackbar";
import { ConfirmNavigationProvider } from "@/lib/shared/components/confirmationDialog/ConfirmNavigationProvider";

// Opt out of the Data Cache and Full Route Cache. All routes are dynamically rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "GA-Lotse",
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  const nonce = await getNonceFromHeader();

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
      <NonceProvider initialNonce={nonce}>
        <ThemeProvider>
          <Box component="body" sx={{ backgroundColor: "neutral.100" }}>
            <noscript>
              Bitte aktivieren Sie JavaScript, um diese Anwendung zu nutzen.
            </noscript>
            <I18nProvider>
              <EnvironmentTypeProvider
                environmentType={env.PUBLIC_ENVIRONMENT_TYPE}
              >
                <EmployeePortalProvider
                  baseUrl={env.PUBLIC_BASE_BACKEND_URL}
                  layoutConfig={LAYOUT_CONFIG}
                >
                  <SnackbarProvider snackbar={EmployeeSnackbar}>
                    <DrawerProvider>
                      <ApiProvider configuration={API_CONFIGURATION}>
                        <ConfirmationDialogProvider
                          component={ConfirmationDialog}
                          errorModal={EmployeePortalErrorModal}
                        >
                          <ConfirmNavigationProvider>
                            <QueryBoundary>
                              <OfflinePasswordPrompt />
                              <ServiceWorkerProvider>
                                <ChatProvider
                                  configuration={CHAT_CONFIGURATION}
                                >
                                  <MainLayout>{children}</MainLayout>
                                </ChatProvider>
                                {modal}
                              </ServiceWorkerProvider>
                            </QueryBoundary>
                          </ConfirmNavigationProvider>
                        </ConfirmationDialogProvider>
                      </ApiProvider>
                    </DrawerProvider>
                  </SnackbarProvider>
                </EmployeePortalProvider>
              </EnvironmentTypeProvider>
            </I18nProvider>

            <HiddenDownloadContainer />
          </Box>
        </ThemeProvider>
      </NonceProvider>
    </html>
  );
}
