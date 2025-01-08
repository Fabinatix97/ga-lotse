/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { YesOrNoWithFollowUp } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/YesOrNoWithFollowUp";
import {
  safeSexRegularityOptions,
  stiProtectiveMeasuresOptions,
  vaccineOptions,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";
import { CheckboxGroupField } from "@/lib/shared/components/formFields/CheckboxGroupField";
import { RadioButtonsField } from "@/lib/shared/components/formFields/RadioButtonsField";

export function Prevention() {
  return (
    <>
      <Typography level="h3" mb={3} id="prevention-section-title">
        Prävention
      </Typography>
      <SectionGrid aria-labelledby="prevention-section-title">
        <CheckboxGroupField
          sx={{ gridColumnStart: "span 2" }}
          name="prevention.vaccinations"
          label="Impfungen"
          options={vaccineOptions}
        />
        <RadioButtonsField
          sx={{ gridColumnStart: "span 2" }}
          name="prevention.safeSexRegularity"
          label="Safer Sex"
          options={safeSexRegularityOptions}
          resettable
        />
        <CheckboxGroupField
          sx={{ gridColumnStart: "span 2" }}
          name="prevention.stiProtectiveMeasures"
          label="Schutz gegen STI"
          options={stiProtectiveMeasuresOptions}
        />
        <YesOrNoWithFollowUp
          name={`prevention.infoAboutPrepDesired`}
          label={"Infos zur PrEP gewünscht?"}
        />
      </SectionGrid>
    </>
  );
}
