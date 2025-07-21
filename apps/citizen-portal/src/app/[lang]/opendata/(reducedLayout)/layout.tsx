/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LayoutProps } from "@eshg/lib-portal";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { ReducedHeader } from "@/lib/baseModule/components/layout/navigationMenu/header/Header";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function OpenDataLayout(props: LayoutProps) {
  return (
    <MainLayout slots={{ header: ReducedHeader }}>
      <PageLayout>{props.children}</PageLayout>
    </MainLayout>
  );
}
