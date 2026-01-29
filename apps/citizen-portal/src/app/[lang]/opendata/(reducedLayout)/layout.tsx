/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LayoutProps } from "@eshg/lib-portal";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function OpenDataLayout(props: LayoutProps) {
  return (
    <MainLayout>
      <PageLayout banner="reduced">{props.children}</PageLayout>
    </MainLayout>
  );
}
