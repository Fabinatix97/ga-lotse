/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { countryOptions } from "@eshg/lib-portal";
import {
  MultiAutocompleteField,
  MultiAutocompleteFieldProps,
} from "@eshg/lib-portal/components/formFields/autocomplete/MultiAutocompleteField";

interface CountryFieldMultiProps
  extends Omit<MultiAutocompleteFieldProps, "options"> {
  label: string;
}

export function CountryFieldMulti(props: CountryFieldMultiProps) {
  const options = countryOptions();
  return <MultiAutocompleteField {...props} options={options} />;
}
