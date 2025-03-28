/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AutocompleteInputChangeReason,
  AutocompleteProps,
  CircularProgress,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode, SyntheticEvent } from "react";
import { identity } from "remeda";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";
import { CustomAutocomplete } from "../inputs/CustomAutocomplete";

import { BaseField, BaseFieldProps, useBaseField } from "./BaseField";

type JoyUiAutocompleteValue<
  TValue extends object | number,
  TMultiple extends boolean,
> = AutocompleteProps<TValue, TMultiple, false, false>["value"];
export type SelectObjectFieldValue<
  TValue extends object | number,
  TMultiple extends boolean,
> = Exclude<JoyUiAutocompleteValue<TValue, TMultiple>, undefined>;

export interface SelectObjectFieldProps<
  TValue extends object | number,
  TMultiple extends boolean,
> extends FieldProps<SelectObjectFieldValue<TValue, TMultiple>> {
  options: TValue[];
  getOptionLabel: (option: TValue) => string;
  disableFiltering?: boolean;
  multiple?: TMultiple;
  placeholder?: string;
  disabled?: boolean;
  onValueChanged?: (value: SelectObjectFieldValue<TValue, TMultiple>) => void;
  onInputChange?: (
    event: SyntheticEvent,
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void;
  loading?: boolean;
  component?: (props: BaseFieldProps) => ReactNode;
  autocomplete?: (
    props: AutocompleteProps<TValue, TMultiple, false, false>,
  ) => ReactNode;
  sx?: SxProps;
  endDecorator?: ReactNode;
}

export function SelectObjectField<
  TValue extends object | number,
  TMultiple extends boolean = false,
>(props: SelectObjectFieldProps<TValue, TMultiple>) {
  const FieldComponent = props.component ?? BaseField;
  const field = useBaseField<SelectObjectFieldValue<TValue, TMultiple>>(props);
  const AutocompleteComponent =
    props.autocomplete ?? CustomAutocomplete<TValue, TMultiple, false, false>;
  const disabled = useIsFormDisabled();

  return (
    <FieldComponent
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
    >
      <AutocompleteComponent
        name={props.name}
        value={field.input.value}
        options={props.options}
        getOptionLabel={props.getOptionLabel}
        getOptionKey={props.getOptionLabel}
        onChange={(_, newValue) => {
          const emptyValue = props.multiple ? [] : null;
          const value = (newValue ?? emptyValue) as SelectObjectFieldValue<
            TValue,
            TMultiple
          >;
          void field.helpers.setValue(value);
          props.onValueChanged?.(value);
        }}
        filterOptions={props.disableFiltering ? identity() : undefined}
        onBlur={field.input.onBlur}
        multiple={props.multiple}
        placeholder={props.placeholder}
        disabled={disabled || props.disabled}
        onInputChange={props.onInputChange}
        loading={props.loading}
        endDecorator={
          props.loading ? (
            <CircularProgress size="sm" />
          ) : (
            (props.endDecorator ?? null)
          )
        }
        sx={props.sx}
      />
    </FieldComponent>
  );
}
