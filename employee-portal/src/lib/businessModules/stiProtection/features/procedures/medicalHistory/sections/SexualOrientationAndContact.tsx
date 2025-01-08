/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MonthAndYearFields } from "@eshg/lib-portal/components/formFields/MonthAndYearFields";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { SectionGrid } from "@/lib/businessModules/stiProtection/components/procedures/procedureDetails/SectionGrid";
import { MedicalHistoryFormData } from "@/lib/businessModules/stiProtection/features/procedures/medicalHistory/MedicalHistoryForm.config";
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
import { validatePositiveInteger } from "@/lib/shared/helpers/validators";

export function SexualOrientationAndContact({
  isForSexWork,
}: {
  isForSexWork: boolean;
}) {
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
          label={"Bisherige Sexparter:innen ist/hat"}
          options={sexualContactFactorOptions}
        />
        {isForSexWork ? (
          <>
            <FieldSetControl>
              <Legend>Seit wann in Sexarbeit?</Legend>
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
