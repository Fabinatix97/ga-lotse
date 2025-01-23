/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiBaseFeature } from "@eshg/citizen-portal-api/base";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { PropsWithChildren } from "react";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function OpenDataLayout(props: PropsWithChildren) {
  const { t } = useTranslation(["opendata/shared"]);
  const isOpenDataEnabled = useIsNewFeatureEnabled(ApiBaseFeature.OpenData);

  return (
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
  );
}
