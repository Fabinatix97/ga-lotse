/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutocompleteProps } from "@mui/joy";
import { ReactNode, SyntheticEvent, useMemo } from "react";

import { FieldProps } from "../../../types/form";
import { BaseFieldProps, useBaseField } from "../BaseField";
import { StyledInputProps } from "../types";

import {
  AutocompleteSelectOption,
  getValueToOptionMap,
  renderAutocompleteSelectOptions,
} from "./AutocompleteSelectOptions";

export interface CommonAutocompleteFieldProps<T>
  extends FieldProps<T>,
    StyledInputProps {
  options: AutocompleteSelectOption[];
  placeholder?: string;
  loading?: boolean;
  endDecorator?: ReactNode;
  onInputChange?: (
    event: SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  onChange?: (value: string[]) => void;
}

interface UseAutocompleteFieldContextReturn<T> {
  field: ReturnType<typeof useBaseField<T>>;
  fieldProps: Omit<BaseFieldProps, "children">;
  autocompleteProps: Pick<
    AutocompleteProps<string, boolean, boolean, boolean>,
    | "name"
    | "onBlur"
    | "disableClearable"
    | "loading"
    | "placeholder"
    | "endDecorator"
    | "forcePopupIcon"
    | "getOptionLabel"
    | "renderOption"
    | "color"
  >;
}

export function useAutocompleteFieldContext<T>(
  props: CommonAutocompleteFieldProps<T>,
): UseAutocompleteFieldContextReturn<T> {
  const valueToOption = useMemo(
    () => getValueToOptionMap(props.options),
    [props.options],
  );

  const field = useBaseField(props);

  return {
    field,
    fieldProps: {
      label: props.label,
      required: field.required,
      error: field.error,
      helperText: field.helperText,
    },
    autocompleteProps: {
      name: props.name,
      onBlur: field.input.onBlur,
      disableClearable: field.required,
      loading: props.loading,
      placeholder: props.placeholder,
      endDecorator: props.endDecorator,
      forcePopupIcon: props.endDecorator === undefined,
      getOptionLabel: (value) => valueToOption.get(value)?.label ?? value,
      renderOption: renderAutocompleteSelectOptions(valueToOption),
      color: props.primary ? "primary" : undefined,
    },
  };
}
