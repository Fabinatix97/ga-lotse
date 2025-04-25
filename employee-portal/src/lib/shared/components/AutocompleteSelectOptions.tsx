/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutocompleteOption, AutocompleteProps, Typography } from "@mui/joy";

import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";

export interface AutocompleteSelectOption extends SelectOption {
  disabled?: boolean;
}

export function renderAutocompleteSelectOptions(
  valueToOption: Map<string, AutocompleteSelectOption>,
): AutocompleteProps<string, undefined, undefined, undefined>["renderOption"] {
  // eslint-disable-next-line react/display-name
  return (optionProps, value) => {
    const option = valueToOption.get(value);
    return (
      <AutocompleteOption
        {...optionProps}
        onClick={option?.disabled ? undefined : optionProps.onClick}
        aria-disabled={option?.disabled}
        key={value}
      >
        <Typography
          level="body-sm"
          textColor={option?.disabled ? "text.secondary" : "text.primary"}
        >
          {option?.label ?? value}
        </Typography>
      </AutocompleteOption>
    );
  };
}

export function getValueToOptionMap(options: AutocompleteSelectOption[]) {
  const map = new Map<string, AutocompleteSelectOption>();
  for (const option of options) {
    map.set(option.value, option);
  }
  return map;
}
