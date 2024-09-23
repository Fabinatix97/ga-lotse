/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { PageBanner } from "@/lib/baseModule/components/layout/PageBanner";
import { LandingpageContent } from "@/lib/businessModules/measlesProtection/pages/landingPage/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/measlesProtection/pages/landingPage/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { Page, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenMeaslesProtectionPage() {
  const { t } = useTranslation("measlesProtection/overview");
  return (
    <Page>
      <PageBanner />
      <PageTitle>{t("page_title")}</PageTitle>
      <TwoColumnGrid
        content={<LandingpageContent />}
        sidePanel={<LandingpageSidePanel />}
      />
    </Page>
  );
}
