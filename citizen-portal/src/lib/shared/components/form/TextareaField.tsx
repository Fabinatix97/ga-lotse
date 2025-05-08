/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Textarea } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";

type Validator<TValue> = (value: TValue) => string | undefined;
export interface ValidationRules<TValue> {
  required?: string;
  validate?: Validator<TValue>;
}

interface TextareaFieldProps extends ValidationRules<string> {
  name: string;
  label?: string | ReactNode;
  placeholder?: string;
  sx?: SxProps;
  sxTextarea?: SxProps;
  readOnly?: boolean;
  minRows?: number;
}

export function TextareaField(props: TextareaFieldProps) {
  const field = useBaseField<string>(props);

  return (
    <BaseField
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={props.sx}
    >
      <Textarea
        sx={props.sxTextarea}
        name={props.name}
        value={field.input.value}
        minRows={props.minRows ?? 2}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        onChange={field.input.onChange}
        onBlur={field.input.onBlur}
      />
    </BaseField>
  );
}
