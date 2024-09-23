/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiTravelMedicineFeature } from "@eshg/citizen-portal-api/travelMedicine";

import { PageBanner } from "@/lib/baseModule/components/layout/PageBanner";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/travelMedicine/api/queries/featureTogglesApi";
import { AppointmentSection } from "@/lib/businessModules/travelMedicine/components/landing/AppointmentSection";
import { LandingpageContent } from "@/lib/businessModules/travelMedicine/components/landing/LandingpageContent";
import { LandingpageSidePanel } from "@/lib/businessModules/travelMedicine/components/landing/LandingpageSidePanel";
import { VaccineOverviewSection } from "@/lib/businessModules/travelMedicine/components/landing/VaccineOverviewSection";
import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";
import {
  OneColumnGrid,
  TwoColumnGrid,
} from "@/lib/shared/components/layout/grid";
import { Page, PageTitle } from "@/lib/shared/components/layout/page";

export default function CitizenTravelMedicineEntryPage() {
  const citizenPortalProcedureEnabled = useIsNewFeatureEnabled(
    ApiTravelMedicineFeature.CitizenPortalProcedure,
  );

  const isMobile = useIsMobile();
  return (
    <Page>
      <PageBanner />
      <PageTitle>Reisemedizinische Impfberatung</PageTitle>
      {isMobile ? (
        <OneColumnGrid
          contentTop={citizenPortalProcedureEnabled && <AppointmentSection />}
          contentCenter={<LandingpageContent />}
          contentBottom={<VaccineOverviewSection />}
        />
      ) : (
        <TwoColumnGrid
          content={<LandingpageContent />}
          sidePanel={
            <LandingpageSidePanel
              citizenPortalProcedureEnabled={citizenPortalProcedureEnabled}
            />
          }
        />
      )}
    </Page>
  );
}
