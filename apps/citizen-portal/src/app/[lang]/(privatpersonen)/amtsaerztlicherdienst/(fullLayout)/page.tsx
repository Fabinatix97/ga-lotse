/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useIsMobile } from "@eshg/lib-portal";

import { LandingpageContent } from "@/lib/businessModules/officialMedicalService/components/landing/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/officialMedicalService/components/landing/LandingpageSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenOmsEntryPage() {
  const { t } = useTranslation(["officialMedicalService/landing"]);
  const isMobile = useIsMobile();

  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        {isMobile ? (
          <OneColumnGrid
            contentTop={<LandingpageSidePanel />}
            contentCenter={<LandingpageContent />}
          />
        ) : (
          <TwoColumnGrid
            content={<LandingpageContent />}
            sidePanel={<LandingpageSidePanel />}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
