/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { Typography } from "@mui/joy";

import { defaultPreviousIllnesses } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { SectionGrid } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/YesOrNoWithFollowUp";
import {
  ExaminableIllnesses,
  examinableIllnessNames,
} from "@/lib/businessModules/stiProtection/shared/constants";

export function PreviousIllnesses() {
  return (
    <>
      <Typography level="title-md" mt={1} id="previous-illnesses-section-title">
        Bisherige Krankheiten
      </Typography>
      <SectionGrid aria-labelledby="previous-illnesses-section-title">
        {Object.keys(defaultPreviousIllnesses)
          .filter((t) => !["other", "otherData"].includes(t))
          .map((diseaseType) => (
            <YesOrNoWithFollowUp
              sx={{ gridColumn: 1 }}
              key={diseaseType}
              name={`previousIllnesses.${diseaseType}`}
              label={examinableIllnessNames[diseaseType as ExaminableIllnesses]}
            />
          ))}
        <YesOrNoWithFollowUp
          sx={{ gridColumn: 1 }}
          label="Andere sexuell übertragbare Krankheit"
          name="previousIllnesses.other"
        >
          <InputField
            name="previousIllnesses.otherData"
            label={"Wenn ja, welche?"}
          />
        </YesOrNoWithFollowUp>
      </SectionGrid>
    </>
  );
}
