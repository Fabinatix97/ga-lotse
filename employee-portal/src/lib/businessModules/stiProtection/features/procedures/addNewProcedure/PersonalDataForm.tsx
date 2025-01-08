/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { EditPersonalDataForm } from "@/lib/businessModules/stiProtection/features/procedures/details/EditPersonalDataSidebar";
import { CountryField } from "@/lib/shared/components/formFields/CountryField";

import { AddNewProcedureForm } from "./AddNewProcedureSidebar";

const thisYear = new Date().getFullYear();
const validateYear = createBoundedIntValidator(
  thisYear - 150,
  thisYear,
  "Bitte ein gültiges Jahr eingeben.",
);

export function PersonalDataForm() {
  return (
    <Stack gap={2}>
      <SelectField
        name="gender"
        label="Geschlecht"
        options={GENDER_OPTIONS}
        required="Bitte ein Geschlecht auswählen."
      />
      <NumberField
        name="yearOfBirth"
        label="Geburtsjahr"
        required="Bitte ein gültiges Jahr eingeben."
        validate={validateYear}
      />
      <CountryField name="countryOfBirth" label="Geburtsland" />
      <NumberField
        name="inGermanySince"
        label="In Deutschland seit"
        validate={validateYear}
      />
    </Stack>
  );
}

export function createBoundedIntValidator(
  min: number,
  max: number,
  message: string,
) {
  return (value: OptionalFieldValue<number | string>) => {
    const int = typeof value === "string" ? parseInt(value, 10) : value;
    const isPositiveInteger = int >= min && int <= max;
    if (isEmptyString(value) || isPositiveInteger) {
      return undefined;
    }

    return message;
  };
}

export function personalDataFormValidation(
  form: AddNewProcedureForm | EditPersonalDataForm,
) {
  if (!form.yearOfBirth || !form.inGermanySince) {
    return;
  }
  const yearOfBirth = parseInt(form.yearOfBirth, 10);
  const inGermanySince = parseInt(form.inGermanySince, 10);
  if (yearOfBirth > inGermanySince) {
    const message =
      "Das Geburtsjahr muss vor dem Zeitpunkt des Aufenthalts in Deutschland liegen.";
    return { inGermanySince: message };
  }
}
