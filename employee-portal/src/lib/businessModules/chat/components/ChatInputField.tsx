/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import {
  BaseField,
  FieldComponentProps,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { StyledInputProps } from "@eshg/lib-portal/components/formFields/types";
import { FieldProps } from "@eshg/lib-portal/types/form";

export interface ChatInputFieldProps
  extends FieldProps<string>,
    FieldComponentProps,
    StyledInputProps {
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
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

export function ChatInputField(props: Readonly<ChatInputFieldProps>) {
  const FieldComponent = props.component ?? BaseField;
  const InputComponent = props.input ?? Input;
  const field = useBaseField<string>(props);
  const disabled = useIsFormDisabled();

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
      disabled={props.disabled ?? disabled}
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
        startDecorator={props.startDecorator}
        endDecorator={props.endDecorator}
        color={props.primary ? "primary" : undefined}
        data-testid={props["data-testid"]}
        aria-label={props["aria-label"]}
        size="lg"
        sx={{
          backgroundColor: "background.surface",
          borderColor: "primary.300",
        }}
        slotProps={{
          input: {
            maxLength: props.maxLength,
            sx: {
              "&::placeholder": {
                color: "primary.300",
              },
            },
          },
        }}
      />
    </FieldComponent>
  );
}
