/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode, SyntheticEvent } from "react";
import { identity } from "remeda";

import { useIsFormDisabled } from "../../form/DisabledFormContext";
import { CustomAutocomplete } from "../../inputs/CustomAutocomplete";
import { BaseField } from "../BaseField";

import {
  CommonAutocompleteFieldProps,
  useAutocompleteFieldContext,
} from "./useAutocompleteFieldContext";

export interface SingleAutocompleteFieldProps
  extends CommonAutocompleteFieldProps<string> {
  freeSolo?: boolean;
  disableFiltering?: boolean;
  popupIcon?: ReactNode;
  disabled?: boolean;
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
    if (props.freeSolo || newValue === "") {
      handleChange(newValue);
    }
  }

  return (
    <BaseField {...fieldProps}>
      <CustomAutocomplete
        {...autocompleteProps}
        multiple={false}
        freeSolo
        forcePopupIcon={!props.freeSolo}
        value={field.input.value}
        options={props.options.map((opt) => opt.value)}
        filterOptions={props.disableFiltering ? identity() : undefined}
        disabled={disabled || props.disabled}
        popupIcon={props.popupIcon}
        onChange={(_, newValue) => {
          handleChange(newValue);
        }}
        onInputChange={handleInputChange}
      />
    </BaseField>
  );
}
