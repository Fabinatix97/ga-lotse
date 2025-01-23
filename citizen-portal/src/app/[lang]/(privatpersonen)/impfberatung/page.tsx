/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { AppointmentSection } from "@/lib/businessModules/travelMedicine/components/landing/AppointmentSection";
import { LandingpageContent } from "@/lib/businessModules/travelMedicine/components/landing/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/travelMedicine/components/landing/LandingpageSidePanel";
import { VaccineOverviewSection } from "@/lib/businessModules/travelMedicine/components/landing/VaccineOverviewSection";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";
import { useIsMobile } from "@/lib/shared/hooks/useIsMobile";

export default function CitizenTravelMedicineEntryPage() {
  const { t } = useTranslation(["travelMedicine/landing"]);

  const isMobile = useIsMobile();
  return (
    <PageLayout banner="private">
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        {isMobile ? (
          <OneColumnGrid
            contentTop={<AppointmentSection />}
            contentCenter={<LandingpageContent />}
            contentBottom={<VaccineOverviewSection />}
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
