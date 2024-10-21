/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input, InputProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import {
  ChangeEvent,
  FocusEvent,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  ReactNode,
} from "react";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { StyledInputProps } from "./types";

export interface InputFieldProps
  extends FieldProps<string>,
    FieldComponentProps,
    StyledInputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  readOnly?: boolean;
  unstyledReadOnly?: boolean;
  disabled?: boolean;
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;
  input?: (props: InputProps) => ReactNode;
  onChange?: (newValue: string) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  onClick?: () => void;
  sx?: SxProps;
  "data-testid"?: string;
  maxLength?: number;
  "aria-label"?: string;
  untrimmedInput?: boolean;
}

export function InputField(props: Readonly<InputFieldProps>) {
  const FieldComponent = props.component ?? BaseField;
  const InputComponent = props.input ?? Input;
  const field = useBaseField<string>(props);
  const disabled = useIsFormDisabled() || props.disabled;

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    field.input.onChange(event);
    props.onChange?.(event.target.value);
  }

  async function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (!props.untrimmedInput) {
      const value = field.input.value;
      const trimmedValue = value.trim();
      if (value !== trimmedValue) {
        await field.helpers.setValue(trimmedValue);
        event.target.value = trimmedValue;
      }
    }
    field.input.onBlur?.(event);
    props.onBlur?.(event);
  }

  return (
    <FieldComponent
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={props.sx}
      fieldDecorator={props.fieldDecorator}
      disabled={disabled}
    >
      <InputComponent
        type={props.type}
        name={props.name}
        value={field.input.value}
        placeholder={props.placeholder}
        onChange={handleChange}
        onFocus={props.onFocus}
        onBlur={handleBlur}
        onClick={props.onClick}
        readOnly={props.readOnly}
        disabled={disabled}
        startDecorator={props.startDecorator}
        endDecorator={props.endDecorator}
        color={props.primary ? "primary" : undefined}
        data-testid={props["data-testid"]}
        aria-label={props["aria-label"]}
        slotProps={{
          input: {
            readOnly: props.readOnly === true || props.unstyledReadOnly,
            maxLength: props.maxLength,
          },
        }}
      />
    </FieldComponent>
  );
}
