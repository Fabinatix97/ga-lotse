/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useState } from "react";

import { ProfessionalRegistrationForm } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { ProfessionalRegistrationFormSuccessPage } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationFormSuccessPage";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function MedicalRegistryCreateProcedurePage() {
  const [showSuccessPage, setShowSuccessPage] = useState(false);

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
