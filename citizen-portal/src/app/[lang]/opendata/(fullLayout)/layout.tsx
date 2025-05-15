/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Alert } from "@eshg/lib-portal/components/Alert";
import { LayoutProps } from "@eshg/lib-portal/types/pageParams";
import { ApiOpenDataFeature } from "@eshg/opendata-api";

import { MainLayout } from "@/lib/baseModule/components/layout/MainLayout";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/opendata/api/queries/featureTogglesApi";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function OpenDataLayout(props: LayoutProps) {
  const { t } = useTranslation(["opendata/shared"]);
  const isOpenDataEnabled = useIsNewFeatureEnabled(ApiOpenDataFeature.OpenData);

  return (
    <MainLayout>
      <PageLayout>
        {isOpenDataEnabled ? (
          props.children
        ) : (
          <PageContent>
            <Alert
              title={t("notAvailable.title")}
              message={t("notAvailable.message")}
              color="primary"
            />
          </PageContent>
        )}
      </PageLayout>
    </MainLayout>
  );
}
