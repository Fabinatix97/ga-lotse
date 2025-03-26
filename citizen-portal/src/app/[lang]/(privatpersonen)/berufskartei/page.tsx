/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiMedicalRegistryFeature } from "@eshg/medical-registry-api";
import { notFound } from "next/navigation";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/medicalRegistry/api/queries/featureTogglesApi";
import { HomeContent } from "@/lib/businessModules/medicalRegistry/pages/home/HomeContent";
import { HomeSidePanel } from "@/lib/businessModules/medicalRegistry/pages/home/HomeSidePanel";
import { useTranslation } from "@/lib/i18n/client";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { TwoColumnGrid } from "@/lib/shared/components/layout/grid";
import { PageLayout, PageTitle } from "@/lib/shared/components/layout/page";

export default function MedicalRegistryCreateProcedurePage() {
  const { t } = useTranslation(["medicalRegistry/overview"]);

  const isMedicalRegistryEnabled = useIsNewFeatureEnabled(
    ApiMedicalRegistryFeature.CitizenPortalEnabled,
  );

  if (!isMedicalRegistryEnabled) {
    notFound();
  }

  return (
    <PageLayout>
      <PageContent>
        <PageTitle>{t("pageTitle")}</PageTitle>
        <TwoColumnGrid
          content={<HomeContent />}
          sidePanel={<HomeSidePanel />}
        />
      </PageContent>
    </PageLayout>
  );
}
