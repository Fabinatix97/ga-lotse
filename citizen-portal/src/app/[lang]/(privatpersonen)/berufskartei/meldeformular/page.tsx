/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiMedicalRegistryFeature } from "@eshg/medical-registry-api";
import { notFound } from "next/navigation";
import { useState } from "react";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/medicalRegistry/api/queries/featureTogglesApi";
import { ProfessionalRegistrationForm } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { ProfessionalRegistrationFormSuccessPage } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationFormSuccessPage";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function MedicalRegistryCreateProcedurePage() {
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  const isMedicalRegistryEnabled = useIsNewFeatureEnabled(
    ApiMedicalRegistryFeature.CitizenPortalEnabled,
  );

  if (!isMedicalRegistryEnabled) {
    notFound();
  }

  return (
    <PageLayout>
      <PageContent>
        {!showSuccessPage ? (
          <ProfessionalRegistrationForm
            setShowSuccessPage={setShowSuccessPage}
          />
        ) : (
          <ProfessionalRegistrationFormSuccessPage
            setShowSuccessPage={setShowSuccessPage}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
