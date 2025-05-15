/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";

import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function Loading() {
  const { t } = useTranslation();
  return (
    <PageLayout>
      <PageContent fullHeight>
        <LoadingIndicator
          text={t("common.page_loading")}
          fullHeight
          flexGrow={1}
        />
      </PageContent>
    </PageLayout>
  );
}
