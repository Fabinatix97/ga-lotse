/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
import { SectionGrid } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/SectionGrid";
import {
  sexWorkTypeOptions,
  sexualContactFactorOptions,
  sexualContactGenderOptions,
  sexualOrientationOptions,
} from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/options";
import {
  CheckboxGroupField,
  FieldSetControl,
} from "@/lib/shared/components/formFields/CheckboxGroupField";
import { Legend } from "@/lib/shared/components/formFields/Legend";

export function SexualOrientationAndContact({
  isForSexWork,
}: {
  isForSexWork: boolean;
}) {
  const { values } = useFormikContext<MedicalHistoryFormData>();
  return (
    <>
      <Typography
        level="title-md"
        mt={1}
        id="sexual-orientation-and-contact-title"
      >
        Sexuelle Orientierung / Kontakte
      </Typography>
      <SectionGrid aria-labelledby="sexual-orientation-and-contact-title">
        <SelectField
          name="sexualOrientationAndContact.sexualOrientation"
          label="Sexuelle Orientierung"
          options={sexualOrientationOptions}
        />
        <NumberField
          name="sexualOrientationAndContact.numberOfSexualPartnersLast12Months"
          label="Anzahl der Sexpartner:innen in den letzten 12 Monaten"
        />
        <CheckboxGroupField
          name="sexualOrientationAndContact.sexualContactGenders"
          label="Sexueller Kontakt"
          options={sexualContactGenderOptions}
        />
        <CheckboxGroupField
          sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
          name="sexualOrientationAndContact.sexualContactFactors"
          label={"Bisherige Sexparter:innen ist/hat"}
          options={sexualContactFactorOptions}
        />
        {isForSexWork ? (
          <>
            <FieldSetControl>
              <Legend variant="single">Seit wann in Sexarbeit?</Legend>
              <MonthAndYearFields
                fieldName="sexualOrientationAndContact.startInSexWork"
                date={values.sexualOrientationAndContact.startInSexWork}
              />
            </FieldSetControl>
            <CheckboxGroupField
              sx={{ gridColumnStart: 1, gridColumnEnd: 3 }}
              name="sexualOrientationAndContact.sexWorkType"
              label={"Arbeitsstätte"}
              options={sexWorkTypeOptions}
            />
          </>
        ) : null}
      </SectionGrid>
    </>
  );
}
