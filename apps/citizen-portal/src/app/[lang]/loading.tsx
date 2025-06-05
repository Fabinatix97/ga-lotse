/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingIndicator } from "@eshg/lib-portal";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { useTranslation } from "@/lib/i18n/client";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <MainLayout>
      <LoadingIndicator
        text={t("common.page_loading")}
        fullHeight
        flexGrow={1}
      />
    </MainLayout>
  );
}
