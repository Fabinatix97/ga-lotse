/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Textarea, TextareaProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FocusEvent, ReactNode } from "react";

import {
  FieldControl,
  useDebouncedFieldControl,
  useFieldControl,
} from "../../hooks/fieldControl";
import { ValidationRules } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { BaseField } from "./BaseField";

interface CommonTextareaFieldProps {
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
  ref?: (el: HTMLInputElement) => void;
}

export interface TextareaFieldProps
  extends CommonTextareaFieldProps,
    ValidationRules<string> {}

export function TextareaField(props: TextareaFieldProps) {
  const control = useFieldControl<string>(props);
  return <TextareaControl {...props} control={control} />;
}

export function DebouncedTextareaField(props: TextareaFieldProps) {
  const control = useDebouncedFieldControl<string>(props);
  return <TextareaControl {...props} control={control} />;
}

export interface TextareaControlProps extends CommonTextareaFieldProps {
  control: FieldControl<string>;
}

function TextareaControl(props: TextareaControlProps) {
  const { control } = props;
  const disabled = useIsFormDisabled() || props.disabled;

  async function handleBlur(event: FocusEvent<HTMLTextAreaElement>) {
    if (!props.untrimmedInput) {
      const value = control.value;
      const trimmedValue = value.trim();
      if (value !== trimmedValue) {
        await control.setValue(trimmedValue);
        event.target.value = trimmedValue;
      }
    }
    await control.setTouched(true);
  }

  return (
    <BaseField
      label={props.label}
      helperText={control.helperText}
      required={control.required}
      error={control.error}
      sx={props.sx}
      disabled={disabled}
      className={props.className}
    >
      <Textarea
        ref={props.ref}
        aria-labelledby={props["label-id"]}
        sx={props.sxTextarea}
        name={props.name}
        value={control.value}
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
        onChange={(event) => control.setValue(event.target.value)}
        onBlur={handleBlur}
      />
    </BaseField>
  );
}
