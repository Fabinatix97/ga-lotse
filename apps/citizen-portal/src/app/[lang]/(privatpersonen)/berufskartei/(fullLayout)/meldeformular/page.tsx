/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

import { ApiBusinessModule } from "@eshg/base-api";

import { ProfessionalRegistrationForm } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationForm";
import { ProfessionalRegistrationFormSuccessPage } from "@/lib/businessModules/medicalRegistry/pages/professionalRegistrationForm/ProfessionalRegistrationFormSuccessPage";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";
import { useHasBusinessModule } from "@/lib/shared/hooks/useHasBusinessModule";

export default function MedicalRegistryCreateProcedurePage() {
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const hasBusinessModule = useHasBusinessModule();

  if (!hasBusinessModule(ApiBusinessModule.MedicalRegistry)) {
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
