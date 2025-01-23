/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiProvider } from "@eshg/lib-portal/api/ApiProvider";
import { HiddenDownloadContainer } from "@eshg/lib-portal/api/files/HiddenDownloadContainer";
import { EnvironmentTypeProvider } from "@eshg/lib-portal/components/EnvironmentTypeProvider";
import { NonceProvider } from "@eshg/lib-portal/components/NonceProvider";
import { QueryBoundary } from "@eshg/lib-portal/components/boundaries/QueryBoundary";
import { ConfirmationDialogProvider } from "@eshg/lib-portal/components/confirmationDialog/ConfirmationDialogProvider";
import { SnackbarProvider } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { getNonceFromHeader } from "@eshg/lib-portal/next/contentSecurityPolicyHeaderMiddleware";
import { Box } from "@mui/joy";
import { ReactNode } from "react";

import { env } from "@/env/server";
import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { ThemeProvider } from "@/lib/baseModule/theme/ThemeProvider";
import { ChatProvider } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CHAT_CONFIGURATION } from "@/lib/businessModules/chat/shared/config";
import { ServiceWorkerProvider } from "@/lib/businessModules/inspection/shared/offline/ServiceWorkerProvider";
import { OfflinePasswordPrompt } from "@/lib/businessModules/inspection/shared/offline/password/OfflinePasswordPrompt";
import { API_CONFIGURATION } from "@/lib/shared/api/config";
import { EmployeeSnackbar } from "@/lib/shared/components/EmployeeSnackbar";
import { EmployeePortalErrorModal } from "@/lib/shared/components/boundaries/EmployeePortalErrorModal";
import { ConfirmNavigationProvider } from "@/lib/shared/components/confirmationDialog/ConfirmNavigationProvider";
import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";
import { DrawerProvider } from "@/lib/shared/components/drawer/drawerContext";

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
      <NonceProvider initialNonce={nonce}>
        <ThemeProvider>
          <Box component="body" sx={{ backgroundColor: "neutral.100" }}>
            <noscript>
              Bitte aktivieren Sie JavaScript, um diese Anwendung zu nutzen.
            </noscript>
            <EnvironmentTypeProvider
              environmentType={env.PUBLIC_ENVIRONMENT_TYPE}
            >
              <SnackbarProvider snackbar={EmployeeSnackbar}>
                <DrawerProvider>
                  <ApiProvider configuration={API_CONFIGURATION}>
                    <ConfirmationDialogProvider
                      component={EmployeePortalConfirmationDialog}
                      errorModal={EmployeePortalErrorModal}
                    >
                      <ConfirmNavigationProvider>
                        <QueryBoundary>
                          <OfflinePasswordPrompt />
                          <ServiceWorkerProvider>
                            <ChatProvider configuration={CHAT_CONFIGURATION}>
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
            </EnvironmentTypeProvider>

            <HiddenDownloadContainer />
          </Box>
        </ThemeProvider>
      </NonceProvider>
    </html>
  );
}
