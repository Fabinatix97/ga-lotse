/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { SyntheticEvent } from "react";

import { CustomAutocomplete } from "@eshg/lib-portal/components/inputs/CustomAutocomplete";

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
      <CustomAutocomplete
        {...autocompleteProps}
        multiple
        freeSolo={false}
        value={field.input.value}
        options={props.options.map((opt) => opt.value)}
        onChange={(_, newValue) => {
          handleChange(newValue);
        }}
        onInputChange={handleInputChange}
      />
    </BaseField>
  );
}
