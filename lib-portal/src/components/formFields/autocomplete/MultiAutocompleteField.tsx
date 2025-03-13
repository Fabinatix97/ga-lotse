/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Autocomplete } from "@mui/joy";
import { SyntheticEvent } from "react";

import { BaseField } from "../BaseField";

import {
  CommonAutocompleteFieldProps,
  useAutocompleteFieldContext,
} from "./useAutocompleteFieldContext";

export type MultiAutocompleteFieldProps = CommonAutocompleteFieldProps<
  string[]
>;

export function MultiAutocompleteField(props: MultiAutocompleteFieldProps) {
  const { field, fieldProps, autocompleteProps } =
    useAutocompleteFieldContext(props);

  function handleChange(newValue: string[]) {
    void field.helpers.setValue(newValue);
    props.onChange?.(newValue);
  }

  function handleInputChange(
    event: SyntheticEvent,
    newValue: string,
    reason: string,
  ) {
    props.onInputChange?.(event, newValue, reason);
  }

  return (
    <BaseField {...fieldProps}>
      <Autocomplete
        {...autocompleteProps}
        multiple={true}
        aria-description="Mehrfachauswahl möglich"
        freeSolo={false}
        value={field.input.value}
        onChange={(_, newValue) => {
          handleChange(newValue);
        }}
        onInputChange={handleInputChange}
        options={props.options.map((opt) => opt.value)}
      />
    </BaseField>
  );
}
