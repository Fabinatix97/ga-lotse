/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Autocomplete } from "@mui/joy";
import { SyntheticEvent } from "react";

import { useIsFormDisabled } from "../../form/DisabledFormContext";
import { BaseField } from "../BaseField";

import {
  CommonAutocompleteFieldProps,
  useAutocompleteFieldContext,
} from "./useAutocompleteFieldContext";

export interface SingleAutocompleteFieldProps
  extends CommonAutocompleteFieldProps<string> {
  freeSolo?: boolean;
}

export function SingleAutocompleteField(props: SingleAutocompleteFieldProps) {
  const { field, fieldProps, autocompleteProps } =
    useAutocompleteFieldContext(props);
  const disabled = useIsFormDisabled();

  function handleChange(newValue: string | null) {
    void field.helpers.setValue(newValue ?? "");
  }

  function handleInputChange(
    event: SyntheticEvent,
    newValue: string,
    reason: string,
  ) {
    props.onInputChange?.(event, newValue, reason);
    if (props.freeSolo) {
      handleChange(newValue);
    }
  }

  return (
    <BaseField {...fieldProps}>
      <Autocomplete
        {...autocompleteProps}
        multiple={false}
        freeSolo={props.freeSolo}
        value={field.input.value}
        onChange={(_, newValue) => {
          handleChange(newValue);
        }}
        onInputChange={handleInputChange}
        options={props.options.map((opt) => opt.value)}
        disabled={disabled}
      />
    </BaseField>
  );
}
