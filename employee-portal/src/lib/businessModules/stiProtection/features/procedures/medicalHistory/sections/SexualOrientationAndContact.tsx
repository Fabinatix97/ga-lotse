/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { FormLabel, Grid, Typography } from "@mui/joy";

import { multiLineEllipsis } from "@/lib/baseModule/theme/theme";
import { AutoWidthHorizontalField } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm";
import {
  medicalHistoryFormFields as fields,
  medicalHistoryFormSections as sections,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import {
  sexualContactOptions,
  sexualOrientationOptions,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";
import { FormGroupGrid } from "@/lib/shared/components/form/FormGroupGrid";

export function SexualOrientationAndContact() {
  return (
    <>
      <Typography
        level="title-md"
        mt={1}
        id="sexual-orientation-and-contact-title"
      >
        {sections.sexualOrientationAndContact}
      </Typography>
      <FormGroupGrid
        component="section"
        aria-labelledby="sexual-orientation-and-contact-title"
      >
        <Grid xxs={12} md={4}>
          <SelectField
            name="sexualOrientation"
            label={fields.sexualOrientation}
            options={sexualOrientationOptions}
            component={AutoWidthHorizontalField}
          />
        </Grid>
        <Grid xxs={12} md={4}>
          <NumberField
            name="numberOfSexualPartnersLast12Months"
            label={
              <FormLabel
                sx={multiLineEllipsis(1)}
                title={fields.numberOfSexualPartnersLast12Months}
              >
                {fields.numberOfSexualPartnersLast12Months}
              </FormLabel>
            }
            required="Bitte eine Zahl eingeben"
            component={AutoWidthHorizontalField}
          />
        </Grid>
        <Grid xxs={12} md={4}>
          <SelectField
            name="sexualContact"
            label={fields.sexualContact}
            options={sexualContactOptions}
            component={AutoWidthHorizontalField}
          />
        </Grid>
      </FormGroupGrid>
    </>
  );
}
