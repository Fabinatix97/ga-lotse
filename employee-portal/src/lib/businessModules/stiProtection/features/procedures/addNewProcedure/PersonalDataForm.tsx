/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { CheckboxField } from "@eshg/lib-employee-portal";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { GENDER_OPTIONS } from "@eshg/lib-portal/components/formFields/constants";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";

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
        label="Biologisches Geschlecht"
        options={GENDER_OPTIONS}
        required="Bitte ein Biologisches Geschlecht auswählen."
      />
      <NumberField
        name="yearOfBirth"
        label="Geburtsjahr"
        required="Bitte ein gültiges Jahr eingeben."
        validate={validateYear}
      />
      <InputField name="pronouns" label="Pronomen" />
      <CheckboxField
        name="hasSufficientGermanLanguageSkills"
        label="Ausreichende Deutschkenntnisse"
      />
      <InputField name="otherKnownLanguages" label="Weitere Sprachen" />
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
