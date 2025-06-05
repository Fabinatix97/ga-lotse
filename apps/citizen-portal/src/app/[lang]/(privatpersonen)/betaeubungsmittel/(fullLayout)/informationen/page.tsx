/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useIsMobile } from "@eshg/lib-portal";

import {
  AppointmentSection,
  LandingPageContent,
  LandingPageSidePanel,
} from "@/lib/businessModules/medsAbroad/components/landing/LandingPageContent";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenTravelingWithMedicationsPage() {
  const { t } = useTranslation(["medsAbroad/overview"]);

  const isMobile = useIsMobile();
  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        {isMobile ? (
          <OneColumnGrid
            contentTop={<AppointmentSection />}
            contentCenter={<LandingPageContent />}
          />
        ) : (
          <TwoColumnGrid
            content={<LandingPageContent />}
            sidePanel={<LandingPageSidePanel />}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
