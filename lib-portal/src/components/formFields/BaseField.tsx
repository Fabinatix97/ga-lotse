/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
} from "@mui/joy";
import { FieldHookConfig, useField } from "formik";
import { ReactNode } from "react";
import { isDefined, isNullish } from "remeda";

import { validatePipe, validateRequired } from "../../helpers/validators";
import { ValidationRules } from "../../types/form";
import { RequiresChildren } from "../../types/react";

export function renderLabel(label: string | ReactNode) {
  if (isNullish(label)) {
    return null;
  }

  if (typeof label === "object") {
    return label;
  }

  return <FormLabel>{label}</FormLabel>;
}

export function renderHelperText(helperText: string | undefined) {
  if (helperText === undefined) {
    return null;
  }

  return <FormHelperText>{helperText}</FormHelperText>;
}

type SupportedFormControlProps = Pick<
  FormControlProps,
  "required" | "error" | "sx" | "disabled" | "className"
>;

export interface BaseFieldProps
  extends SupportedFormControlProps,
    RequiresChildren {
  label?: string | ReactNode;
  helperText?: string;
  error?: boolean;
  fieldDecorator?: ReactNode;
}

export function BaseField(props: BaseFieldProps) {
  const {
    label,
    helperText,
    fieldDecorator: _,
    children,
    ...formControlProps
  } = props;

  return (
    <FormControl {...formControlProps}>
      {renderLabel(label)}
      {children}
      {renderHelperText(helperText)}
    </FormControl>
  );
}

export interface FieldComponentProps {
  component?: (props: BaseFieldProps) => ReactNode;
  fieldDecorator?: ReactNode;
}

interface UseBaseFieldProps<TValue>
  extends Pick<FieldHookConfig<TValue>, "name" | "type">,
    ValidationRules<TValue> {
  hint?: string;
}

export function useBaseField<TValue>(props: UseBaseFieldProps<TValue>) {
  const [input, meta, helpers] = useField<TValue>({
    type: props.type,
    name: props.name,
    validate: resolveValidationRules(props),
  });

  const required = isDefined(props.required);
  const error = isDefined(meta.error) && meta.touched;
  const helperText = error ? meta.error : props.hint;

  return {
    input,
    meta,
    helpers,
    required,
    error,
    helperText,
  };
}

function resolveValidationRules<TValue>(rules: ValidationRules<TValue>) {
  return validatePipe(
    isDefined(rules.required) ? validateRequired(rules.required) : undefined,
    rules.validate,
  );
}
