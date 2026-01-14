/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { useId } from "react";

import {
  CheckboxGroupField,
  FieldSetControl,
  Legend,
  MonthAndYearFields,
  NumberField,
  SelectField,
  validatePositiveInteger,
} from "@eshg/lib-portal";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import {
  sexWorkTypeOptions,
  sexualContactFactorOptions,
  sexualContactGenderOptions,
  sexualOrientationOptions,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";

export function SexualOrientationAndContact({
  isForSexWork,
}: {
  isForSexWork: boolean;
}) {
  const startInSexWorkId = useId();
  const { values } = useFormikContext<MedicalHistoryFormData>();
  return (
    <>
      <Typography level="h3" mb={3} id="sexual-orientation-and-contact-title">
        Sexuelle Orientierung / Kontakte
      </Typography>
      <SectionGrid
        aria-labelledby="sexual-orientation-and-contact-title"
        columns="1fr 1fr"
      >
        <SelectField
          name="sexualOrientationAndContact.sexualOrientation"
          label="Sexuelle Orientierung"
          options={sexualOrientationOptions}
        />
        <NumberField
          name="sexualOrientationAndContact.numberOfSexualPartnersLast12Months"
          label="Anzahl der Sexpartner:innen in den letzten 12 Monaten"
          validate={validatePositiveInteger}
        />
        <CheckboxGroupField
          name="sexualOrientationAndContact.sexualContactGenders"
          label="Sexueller Kontakt"
          options={sexualContactGenderOptions}
        />
        <CheckboxGroupField
          sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
          name="sexualOrientationAndContact.sexualContactFactors"
          label="Bisherige Sexpartner:innen ist/hat"
          options={sexualContactFactorOptions}
        />
        {isForSexWork ? (
          <>
            <FieldSetControl>
              <Legend id={startInSexWorkId}>Seit wann in Sexarbeit?</Legend>
              <MonthAndYearFields
                fieldName="sexualOrientationAndContact.startInSexWork"
                date={values.sexualOrientationAndContact.startInSexWork}
                aria-labelledby={startInSexWorkId}
              />
            </FieldSetControl>
            <CheckboxGroupField
              sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
              name="sexualOrientationAndContact.sexWorkType"
              label="Arbeitsstätte"
              options={sexWorkTypeOptions}
            />
          </>
        ) : null}
      </SectionGrid>
    </>
  );
}
