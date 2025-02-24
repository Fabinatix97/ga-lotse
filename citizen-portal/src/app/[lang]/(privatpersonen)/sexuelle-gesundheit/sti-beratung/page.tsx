/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiConcern } from "@eshg/sti-protection-api";

import { LandingpageContent } from "@/lib/businessModules/stiProtection/pages/landingpage/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/stiProtection/pages/landingpage/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenStiConsultationPage() {
  const { t } = useTranslation(["stiProtection/overview"]);

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("page_title_sti_consultation")}</PageTitle>
        <TwoColumnGrid
          content={
            <LandingpageContent concern={ApiConcern.HivStiConsultation} />
          }
          sidePanel={<LandingpageSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
