/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DentalExaminationJawTabs } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/DentalExaminationJawTabs";
import { FullDentitionOverview } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/FullDentitionOverview";
import { Legend } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/Legend";
import { LowerJawForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/LowerJawForm";
import { UpperJawForm } from "@/lib/businessModules/dental/features/prophylaxisSessions/dentalExamination/UpperJawForm";
import { InformationSheet } from "@/lib/shared/components/infoTile/InformationSheet";

export function DentalExaminationFormSection() {
  return (
    <InformationSheet aria-label="Gebissformular" component="section">
      <DentalExaminationJawTabs
        upperJaw={<UpperJawForm />}
        lowerJaw={<LowerJawForm />}
        fullDentition={<FullDentitionOverview />}
      />
      <Legend />
    </InformationSheet>
  );
}
