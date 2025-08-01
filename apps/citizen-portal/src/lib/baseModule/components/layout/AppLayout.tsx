/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint @next/next/no-head-element: 0 */
import { Box } from "@mui/joy";
import { PropsWithChildren } from "react";

import {
  ApiProvider,
  ConfirmationDialogProvider,
  EnvironmentTypeProvider,
  HiddenDownloadContainer,
  QueryBoundary,
  SnackbarProvider,
} from "@eshg/lib-portal";

import { env } from "@/env/server";
import { ConfirmNavigationProvider } from "@/lib/baseModule/components/ConfirmNavigationProvider";
import { ThemeProvider } from "@/lib/baseModule/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { API_CONFIGURATION } from "@/lib/shared/api/config";
import { CitizenSnackbar } from "@/lib/shared/components/CitizenSnackbar";
import { CitizenPortalErrorModal } from "@/lib/shared/components/boundaries/CitizenPortalErrorModal";
import { CitizenPortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/CitizenPortalConfirmationDialog";

export function AppLayout({
  lang,
  children,
}: Readonly<
  PropsWithChildren<{
    lang: string;
  }>
>) {
  return (
    <I18nProvider lang={lang}>
      <ThemeProvider>
        <Box component="html" sx={{ height: "100%" }} lang={lang}>
          <Box
            component="body"
            sx={{
              backgroundColor: "neutral.100",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              width: "100vw",
              overflowX: "hidden",
            }}
          >
            <noscript>
              Bitte aktivieren Sie JavaScript, um diese Anwendung zu nutzen.
            </noscript>
            <EnvironmentTypeProvider
              environmentType={env.PUBLIC_ENVIRONMENT_TYPE}
            >
              <SnackbarProvider snackbar={CitizenSnackbar}>
                <ApiProvider configuration={API_CONFIGURATION}>
                  <ConfirmationDialogProvider
                    component={CitizenPortalConfirmationDialog}
                    errorModal={CitizenPortalErrorModal}
                  >
                    <ConfirmNavigationProvider>
                      <QueryBoundary>{children}</QueryBoundary>
                    </ConfirmNavigationProvider>
                  </ConfirmationDialogProvider>
                </ApiProvider>
              </SnackbarProvider>
            </EnvironmentTypeProvider>

            <HiddenDownloadContainer />
          </Box>
        </Box>
      </ThemeProvider>
    </I18nProvider>
  );
}
