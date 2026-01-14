/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SingleAutocompleteField,
  SingleAutocompleteFieldProps,
  isEmptyString,
} from "@eshg/lib-portal";

import { useTranslation } from "@/lib/i18n/client";
import { useTranslateCountry } from "@/lib/i18n/useTranslateCountry";

interface CountryFieldProps
  extends Omit<
    SingleAutocompleteFieldProps,
    "options" | "validate" | "required"
  > {
  label: string;
  required?: string | undefined | true;
}

export function CountryField(props: CountryFieldProps) {
  const { countryOptions } = useTranslateCountry();
  const options = countryOptions();
  const { t } = useTranslation("validation");
  const requiredText =
    props.required === true
      ? t("select_country", { label: props.label })
      : props.required;
  return (
    <SingleAutocompleteField
      {...props}
      options={options}
      validate={(value) => {
        if (
          isEmptyString(value) ||
          options.find((opt) => opt.value === value)
        ) {
          return;
        }
        return requiredText;
      }}
      required={requiredText}
    />
  );
}
