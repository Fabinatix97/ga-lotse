/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input, InputProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormikErrors } from "formik";
import {
  ChangeEvent,
  FocusEvent,
  FocusEventHandler,
  HTMLInputTypeAttribute,
  ReactNode,
  memo,
} from "react";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { FieldVariantProps } from "./types";

export interface InputFieldProps
  extends FieldProps<string>,
    FieldComponentProps,
    FieldVariantProps {
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
  "aria-details"?: string;
  "aria-describedby"?: string;
  untrimmedInput?: boolean;
  autoComplete?: InputProps["autoComplete"];
  autoFocus?: boolean;
  ref?: (el: HTMLInputElement) => void;
}

export function InputField(props: Readonly<InputFieldProps>) {
  const field = useBaseField<string>(props);

  return (
    <MemoizedInputField
      {...props}
      ref={props.ref}
      fieldHelperText={field.helperText}
      fieldRequired={field.required}
      fieldError={field.error}
      fieldInputValue={field.input.value}
      fieldHelpersSetValue={field.helpers.setValue}
      fieldInputOnBlur={field.input.onBlur}
      fieldInputOnChange={field.input.onChange}
    />
  );
}

interface InnerInputFieldProps extends InputFieldProps {
  fieldHelperText?: string;
  fieldRequired: boolean;
  fieldError: boolean;
  fieldInputValue: string;
  fieldHelpersSetValue: (
    value: string,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<string>>;
  fieldInputOnBlur: (event: FocusEvent<HTMLInputElement>) => void;
  fieldInputOnChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const MemoizedInputField = memo(function InnerInputField(
  props: Readonly<InnerInputFieldProps>,
) {
  const FieldComponent = props.component ?? BaseField;
  const InputComponent = props.input ?? Input;
  const disabled = useIsFormDisabled() || props.disabled;
  const {
    fieldHelperText,
    fieldError,
    fieldRequired,
    fieldHelpersSetValue,
    fieldInputValue,
    fieldInputOnBlur,
    fieldInputOnChange,
  } = props;

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    fieldInputOnChange(event);
    props.onChange?.(event.target.value);
  }

  async function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (!props.untrimmedInput) {
      const value: string | undefined = fieldInputValue;
      const trimmedValue = value?.trim();
      if (value !== trimmedValue) {
        await fieldHelpersSetValue(trimmedValue);
        event.target.value = trimmedValue;
      }
    }
    fieldInputOnBlur?.(event);
    props.onBlur?.(event);
  }

  return (
    <FieldComponent
      label={props.label}
      helperText={fieldHelperText}
      required={fieldRequired}
      error={fieldError}
      sx={props.sx}
      fieldDecorator={props.fieldDecorator}
      disabled={disabled}
    >
      <InputComponent
        type={props.type}
        name={props.name}
        value={fieldInputValue}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        disabled={disabled}
        startDecorator={props.startDecorator}
        endDecorator={props.endDecorator}
        color={props.primary ? "primary" : undefined}
        data-testid={props["data-testid"]}
        aria-label={props["aria-label"]}
        autoComplete={props.autoComplete}
        slotProps={{
          input: {
            ref: props.ref,
            readOnly: props.readOnly === true || props.unstyledReadOnly,
            maxLength: props.maxLength,
            "aria-details": props["aria-details"],
            "aria-describedby": props["aria-describedby"],
            autoFocus: props.autoFocus ?? false,
            max: props.type === "date" ? "9999-12-31" : undefined,
          },
        }}
        onChange={handleChange}
        onFocus={props.onFocus}
        onBlur={handleBlur}
        onClick={props.onClick}
      />
    </FieldComponent>
  );
});
