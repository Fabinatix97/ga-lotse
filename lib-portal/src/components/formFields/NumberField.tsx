/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input, InputProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, ReactNode } from "react";
import { isDefined } from "remeda";

import { FieldProps, OptionalFieldValue } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { StyledInputProps } from "./types";

export interface NumberFieldProps
  extends FieldProps<OptionalFieldValue<number>>,
    FieldComponentProps,
    StyledInputProps {
  input?: (props: InputProps) => ReactNode;
  sx?: SxProps;
  fieldSx?: SxProps;
  onChange?: (newValue: OptionalFieldValue<number>) => void;
  min?: number;
  max?: number;
  endDecorator?: ReactNode;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export function NumberField(props: NumberFieldProps) {
  const FieldComponent = props.component ?? BaseField;
  const InputComponent = props.input ?? Input;
  const field = useBaseField<OptionalFieldValue<number>>(props);
  const disabled = useIsFormDisabled() || props.disabled;

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = event.target.valueAsNumber;
    const newValue = Number.isNaN(rawValue) ? "" : rawValue;

    await field.helpers.setValue(newValue);
    if (isDefined(props.onChange)) {
      props.onChange(newValue);
    }
  }

  return (
    <FieldComponent
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      fieldDecorator={props.fieldDecorator}
      error={field.error}
      disabled={disabled}
      sx={props.fieldSx}
    >
      <InputComponent
        type="number"
        name={props.name}
        value={field.input.value}
        slotProps={{
          input: {
            min: props.min,
            max: props.max,
          },
        }}
        color={props.primary ? "primary" : undefined}
        disabled={disabled}
        readOnly={props.readOnly}
        endDecorator={props.endDecorator}
        placeholder={props.placeholder}
        onChange={handleChange}
        onBlur={field.input.onBlur}
      />
    </FieldComponent>
  );
}
