/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { InfoOutlined } from "@mui/icons-material";
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  FormLabel,
  Stack,
} from "@mui/joy";
import { useField } from "formik";
import { ReactNode } from "react";
import { isDefined, isNullish } from "remeda";
import { useDebounce } from "use-debounce";

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

export function FormHelperTextWithIcon({
  helperText,
  id,
  testId,
}: {
  helperText: string;
  id?: string;
  testId?: string;
}) {
  const helperTextWithIcon = (
    <Stack data-testid={testId} gap={0.5} direction="row" alignItems="center">
      <InfoOutlined fontSize="xl" />
      {helperText}
    </Stack>
  );

  // Apparently the id is set implicitly, if it is not set.
  // However, if it is set, even if id === undefined, then it is NOT implicitly set.
  if (isDefined(id)) {
    return <FormHelperText id={id}>{helperTextWithIcon}</FormHelperText>;
  }

  return <FormHelperText>{helperTextWithIcon}</FormHelperText>;
}

export function renderHelperText(helperText: string | undefined) {
  if (helperText === undefined) {
    return null;
  }

  return <FormHelperTextWithIcon helperText={helperText} />;
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

  const [debouncedHelperText] = useDebounce(helperText, 1);

  return (
    <FormControl {...formControlProps}>
      {renderLabel(label)}
      {children}
      {renderHelperText(debouncedHelperText)}
    </FormControl>
  );
}

export interface FieldComponentProps {
  component?: (props: BaseFieldProps) => ReactNode;
  fieldDecorator?: ReactNode;
}

export interface UseBaseFieldProps<TValue> extends ValidationRules<TValue> {
  name: string;
  type?: string;
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
