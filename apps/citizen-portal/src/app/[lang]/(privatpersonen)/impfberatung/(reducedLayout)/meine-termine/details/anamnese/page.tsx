/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MedicalHistoryStepper } from "@/lib/businessModules/travelMedicine/components/medicalHistory/MedicalHistoryStepper";
import { PageContent } from "@/lib/shared/components/layout/PageContent";

export default function AnswerMedicalHistoryPage() {
  return (
    <PageContent>
      <MedicalHistoryStepper />
    </PageContent>
  );
}
