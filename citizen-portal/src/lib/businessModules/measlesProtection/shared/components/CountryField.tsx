/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiCountryCode } from "@eshg/citizen-portal-api/measlesProtection";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
} from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { isEmptyString } from "@eshg/lib-portal/helpers/guards";
import { isDefined } from "remeda";

function getRegionLocale(locale: string) {
  return new Intl.DisplayNames(locale, { type: "region" });
}

export function countryOptions(locale = "de-DE"): SelectOption[] {
  const translation = getRegionLocale(locale);
  const options = Array.from(Object.values(ApiCountryCode))
    .map((value) => ({
      value,
      label: translation.of(value),
    }))
    .filter(({ label }) => isDefined(label)) as SelectOption[];
  options.sort(({ label: a }, { label: b }) => a.localeCompare(b));
  return options;
}

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
          options.find((opt) => opt.value === value)
        ) {
          return undefined;
        }
        return `Bitte ein ${props.label} auswählen.`;
      }}
    />
  );
}
