/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MultiAutocompleteField,
  MultiAutocompleteFieldProps,
} from "@eshg/lib-portal/components/formFields/autocomplete/MultiAutocompleteField";

import { countryOptions } from "@/lib/shared/helpers/i18n";

interface CountryFieldMultiProps
  extends Omit<MultiAutocompleteFieldProps, "options"> {
  label: string;
}

export function CountryFieldMulti(props: CountryFieldMultiProps) {
  const options = countryOptions();
  return <MultiAutocompleteField {...props} options={options} />;
}
