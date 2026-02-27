/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LayoutProps } from "@eshg/lib-portal";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
