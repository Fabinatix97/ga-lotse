/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
} from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";

import { countryOptions } from "@/lib/shared/helpers/i18n";

interface CountryFieldProps
  extends Omit<SingleAutocompleteFieldProps, "options" | "validate"> {
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
    />
  );
}
