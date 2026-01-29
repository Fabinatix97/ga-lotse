/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MultiAutocompleteField,
  MultiAutocompleteFieldProps,
  countryOptions,
} from "@eshg/lib-portal";

interface CountryFieldMultiProps extends Omit<
  MultiAutocompleteFieldProps,
  "options"
> {
  label: string;
}

export function CountryFieldMulti(props: CountryFieldMultiProps) {
  const options = countryOptions();
  return <MultiAutocompleteField {...props} options={options} />;
}
