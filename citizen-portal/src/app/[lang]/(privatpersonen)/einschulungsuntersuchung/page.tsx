/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LandingpageContent } from "@/lib/businessModules/schoolEntry/pages/landingpage/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/schoolEntry/pages/landingpage/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenSchoolEntryPage() {
  const { t } = useTranslation(["schoolEntry/overview"]);

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        <TwoColumnGrid
          content={<LandingpageContent />}
          sidePanel={<LandingpageSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
