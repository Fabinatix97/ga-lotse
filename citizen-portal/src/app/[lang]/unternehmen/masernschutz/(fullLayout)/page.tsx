/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LandingpageContent } from "@/lib/businessModules/measlesProtection/pages/landingPage/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/measlesProtection/pages/landingPage/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenMeaslesProtectionPage() {
  const { t } = useTranslation("measlesProtection/overview");
  return (
    <PageLayout banner="business">
      <PageContent>
        <PageTitle>{t("page_title")}</PageTitle>
        <TwoColumnGrid
          content={<LandingpageContent />}
          sidePanel={<LandingpageSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
