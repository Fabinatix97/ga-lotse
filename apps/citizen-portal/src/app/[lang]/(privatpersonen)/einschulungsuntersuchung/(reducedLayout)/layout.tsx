/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LayoutProps } from "@eshg/lib-portal";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { ReducedHeader } from "@/lib/baseModule/components/layout/navigationMenu/header/Header";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function Layout({ children }: LayoutProps) {
  return (
    <MainLayout slots={{ header: ReducedHeader }}>
      <PageLayout banner="reduced">{children}</PageLayout>
    </MainLayout>
  );
}
