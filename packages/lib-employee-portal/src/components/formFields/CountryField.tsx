/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
  countryOptions,
  isEmptyString,
} from "@eshg/lib-portal";

interface CountryFieldProps extends Omit<
  SingleAutocompleteFieldProps,
  "options" | "validate"
> {
  label: string;
}

export function CountryField(props: CountryFieldProps) {
  const options = countryOptions();
  return (
    <SingleAutocompleteField
      {...props}
      options={options}
      validate={(value) => {
        if (
          isEmptyString(value) ||
          value === null ||
          options.find((opt) => opt.value === value)
        ) {
          return undefined;
        }
        return `Bitte ein ${props.label} auswählen.`;
      }}
      isOptionEqualToValue={(option, value) => {
        return isEmptyString(value) || option === value;
      }}
    />
  );
}
