/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { YesOrNoWithFollowUp } from "@eshg/lib-portal/components/formFields/YesOrNoWithFollowUp";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { defaultPreviousIllnesses } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import {
  ExaminableIllnesses,
  examinableIllnessNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

export function PreviousIllnesses() {
  return (
    <>
      <Typography level="h3" mb={3} id="previous-illnesses-section-title">
        Bisherige Infektionen
      </Typography>
      <SectionGrid
        aria-labelledby="previous-illnesses-section-title"
        defaultColumn={1}
      >
        {Object.keys(defaultPreviousIllnesses)
          .filter((t) => !["other", "otherData"].includes(t))
          .map((diseaseType) => (
            <YesOrNoWithFollowUp
              key={diseaseType}
              name={`previousIllnesses.${diseaseType}`}
              label={examinableIllnessNames[diseaseType as ExaminableIllnesses]}
            />
          ))}
        <YesOrNoWithFollowUp
          label="Andere sexuell übertragbare Infektionen"
          name="previousIllnesses.other"
        >
          <InputField
            sx={{ gridColumn: 2 }}
            name="previousIllnesses.otherData"
            label="Wenn ja, welche?"
          />
        </YesOrNoWithFollowUp>
      </SectionGrid>
    </>
  );
}
