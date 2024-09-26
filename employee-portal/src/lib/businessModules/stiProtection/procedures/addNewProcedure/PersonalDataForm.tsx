/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { isEmptyString, isInteger } from "@eshg/lib-portal/helpers/guards";
import { OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Stack } from "@mui/joy";

import { COUNTRY_CODE_OPTIONS } from "@/lib/businessModules/stiProtection/shared/countryCodes";
import { GENDER_OPTIONS } from "@/lib/shared/components/personSidebar/constants";

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
      <SingleAutocompleteField
        name="countryOfBirth"
        label="Geburtsland"
        options={COUNTRY_CODE_OPTIONS}
      />
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
  return (value: OptionalFieldValue<number>) => {
    const isPositiveInteger = isInteger(value) && value >= min && value <= max;
    if (isEmptyString(value) || isPositiveInteger) {
      return undefined;
    }

    return message;
  };
}
