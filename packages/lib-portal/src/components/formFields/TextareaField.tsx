/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Textarea, TextareaProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FocusEvent, ReactNode } from "react";

import { ValidationRules } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField, useBaseField } from "./BaseField";

export interface TextareaFieldProps extends ValidationRules<string> {
  name: string;
  label?: string | ReactNode;
  placeholder?: string;
  sx?: SxProps;
  sxTextarea?: SxProps;
  readOnly?: boolean;
  "label-id"?: string;
  minRows?: number;
  untrimmedInput?: boolean;
  disabled?: boolean;
  "data-testid"?: string;
  "aria-label"?: string;
  slotProps?: TextareaProps["slotProps"];
  className?: string;
}

export function TextareaField(props: TextareaFieldProps) {
  const field = useBaseField<string>(props);
  const disabled = useIsFormDisabled() || props.disabled;

  async function handleBlur(event: FocusEvent<HTMLTextAreaElement>) {
    if (!props.untrimmedInput) {
      const value = field.input.value;
      const trimmedValue = value.trim();
      if (value !== trimmedValue) {
        await field.helpers.setValue(trimmedValue);
        event.target.value = trimmedValue;
      }
    }
    field.input.onBlur?.(event);
  }

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={props.sx}
      disabled={disabled}
      className={props.className}
    >
      <Textarea
        aria-labelledby={props["label-id"]}
        sx={props.sxTextarea}
        name={props.name}
        value={field.input.value}
        minRows={props.minRows ?? 2}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        disabled={disabled}
        slotProps={{
          ...props.slotProps,
          textarea: { ...props.slotProps?.textarea, disabled },
        }}
        data-testid={props["data-testid"]}
        aria-label={props["aria-label"]}
        onChange={field.input.onChange}
        onBlur={handleBlur}
      />
    </BaseField>
  );
}
