/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SnackbarProvider } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Stack } from "@mui/joy";
import { PropsWithChildren, Suspense, useEffect, useState } from "react";

import { AdminSnackbar } from "@/lib/components/AdminSnackbar";
import {
  EntityCart,
  EntityCartProvider,
} from "@/lib/components/context/EntityCart";
import { Heading } from "@/lib/components/layout/heading/Heading";
import { Navigation } from "@/lib/components/layout/nav/Navigation";
import { Content } from "@/lib/components/layout/page/Content";
import { useTranslation } from "@/lib/i18n/client";

export function MainLayoutWithProviders({
  children,
}: Readonly<PropsWithChildren>) {
  const { t } = useTranslation();

  // disable SSR
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return false;

  return (
    <SnackbarProvider snackbar={AdminSnackbar} closeLabel={t("close")}>
      <EntityCartProvider>
        <Suspense>
          <MainLayout>{children}</MainLayout>
        </Suspense>
      </EntityCartProvider>
    </SnackbarProvider>
  );
}

export function MainLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <>
      <Heading />
      <Stack>
        <Navigation />
        <Content>{children}</Content>
        <EntityCart />
      </Stack>
    </>
  );
}
