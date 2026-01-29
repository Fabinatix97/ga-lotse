/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { AutocompleteProps, CircularProgress } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FocusEvent, ReactNode, SyntheticEvent, useMemo } from "react";

import { FieldProps } from "../../../types/form";
import { BaseFieldProps, useBaseField } from "../BaseField";
import { FieldVariantProps } from "../types";

import {
  AutocompleteSelectOption,
  getValueToOptionMap,
  renderAutocompleteSelectOptions,
} from "./AutocompleteSelectOptions";

export interface CommonAutocompleteFieldProps<T>
  extends FieldProps<T>, FieldVariantProps {
  options: AutocompleteSelectOption[];
  placeholder?: string;
  loading?: boolean;
  fetching?: boolean;
  endDecorator?: ReactNode;
  onInputChange?: (
    event: SyntheticEvent,
    value: string,
    reason: string,
  ) => void;
  onChange?: (value: T) => void;
  isOptionEqualToValue?: (option: string, value: string) => boolean;
  onBlur?: (e: FocusEvent) => void;
  sx?: SxProps;
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
    | "isOptionEqualToValue"
    | "sx"
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
      sx: props.sx,
    },
    autocompleteProps: {
      name: props.name,
      onBlur: (e) => {
        field.input.onBlur(e);
        props.onBlur?.(e);
      },
      sx: props.sx,
      disableClearable: field.required,
      loading: props.loading,
      placeholder: props.placeholder,
      endDecorator:
        (props.fetching ?? props.loading) ? (
          <>
            <CircularProgress size="sm" />
            {props.endDecorator}
          </>
        ) : (
          props.endDecorator
        ),
      forcePopupIcon: props.endDecorator === undefined,
      getOptionLabel: (value) => valueToOption.get(value)?.label ?? value,
      renderOption: renderAutocompleteSelectOptions(valueToOption),
      color: props.primary ? "primary" : undefined,
      isOptionEqualToValue: props.isOptionEqualToValue,
    },
  };
}
