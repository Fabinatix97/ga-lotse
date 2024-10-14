/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MedicalHistoryStepper } from "@/lib/businessModules/travelMedicine/components/medicalHistory/MedicalHistoryStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";
import { PageLayout } from "@/lib/shared/components/layout/page";

export default function AnswerMedicalHistoryPage() {
  return (
    <PageLayout>
      <PageContent>
        <MedicalHistoryStepper />
      </PageContent>
    </PageLayout>
  );
}
