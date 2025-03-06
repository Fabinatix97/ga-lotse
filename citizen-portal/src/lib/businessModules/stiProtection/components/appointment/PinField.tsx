/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from "@eshg/lib-portal/components/Row";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { getPropertyIf } from "@eshg/lib-portal/helpers/getProperty";
import {
  FormHelperText,
  FormHelperTextProps,
  FormLabel,
  FormLabelProps,
  Input,
  styled,
} from "@mui/joy";
import { useFormikContext } from "formik";
import { useMemo } from "react";
import { isString } from "remeda";

import { usePinFieldEventHandlers } from "./usePinFieldEventHandlers";

interface PinFieldGeneralProps {
  name: string;
  length: number;
  label: string;
  required?: string;
  invalidError?: string;
  hint?: string;
  digitLabel: (num: number) => string;
}

interface PinFieldComparisonProps {
  comparisonName: string;
  comparisonError: string;
}

type PinFieldProps =
  | (PinFieldComparisonProps & PinFieldGeneralProps)
  | PinFieldGeneralProps;

export function PinField(props: PinFieldProps) {
  const range = Array(props.length).fill(0) as number[];

  const { getFieldMeta } = useFormikContext();
  let compareWith: string | undefined;
  const comparisonName = getPropertyIf(props, "comparisonName", isString);
  if (comparisonName) {
    const { value: otherValue } = getFieldMeta(comparisonName);
    compareWith = isString(otherValue) ? otherValue : "";
  }
  const validate = useValidation({
    requiredError: props.required,
    invalidError: props.invalidError,
    comparisonError: getPropertyIf(props, "comparisonError", isString),
    compareWith,
  });
  const { input, helpers, required, helperText, error } = useBaseField<string>({
    type: "",
    name: props.name,
    validate,
    required: props.required,
    hint: props.hint,
  });
  const valueParts = (input.value ?? "").split("-");
  const events = usePinFieldEventHandlers({
    range,
    setValue: helpers.setValue,
    value: input.value ?? "",
  });

  return (
    <PinFieldset>
      <Legend>{props.label} *</Legend>
      <Row gap={2} flexWrap="nowrap" width="100%">
        {range.map((_, index) => {
          const digit = valueParts[index] ?? "";
          return (
            <PinDigit
              aria-label={props.digitLabel(index + 1)}
              slotProps={{
                input: { maxLength: 1, sx: { textAlign: "center" } },
              }}
              value={digit}
              key={index}
              name={`${props.name}.${index}`}
              onBlur={input.onBlur}
              inputMode="numeric"
              {...events}
              error={error && isDigitInvalid(digit, index, compareWith)}
              required={required}
            />
          );
        })}
      </Row>
      <HelperText error={error}>{helperText}</HelperText>
    </PinFieldset>
  );
}

interface UseValidationArgs {
  requiredError?: string;
  invalidError?: string;
  comparisonError?: string;
  compareWith?: string;
}
function useValidation({
  requiredError,
  invalidError,
  compareWith,
  comparisonError,
}: UseValidationArgs) {
  return useMemo(
    () =>
      validateWhole({
        requiredError,
        compareWith,
        comparisonError,
        invalidError,
      }),
    [requiredError, compareWith, comparisonError, invalidError],
  );
}

function isDigitInvalid(
  value: string,
  index: number,
  compareWith: string | undefined,
) {
  if (!value) {
    return true;
  }
  if (isNaN(parseInt(value))) {
    return true;
  }
  if (!compareWith) {
    return false;
  }
  const compareParts = compareWith.split("-");
  return compareParts[index] !== value;
}

function validateWhole({
  requiredError,
  invalidError,
  comparisonError,
  compareWith,
}: UseValidationArgs) {
  return (value: string) => {
    const valueParts = value.split("-");
    if (!value || valueParts.some((k) => !k.trim())) {
      return requiredError;
    }
    if (valueParts.some((k) => isNaN(parseInt(k)))) {
      return invalidError;
    }
    if (compareWith !== value) {
      return comparisonError;
    }
  };
}

const StyledLegend = styled(FormLabel)(({ theme }) => ({
  margin: "0 0 0.375rem 0",
  fontWeight: theme.fontWeight.md,
}));

function Legend({ children, ...props }: FormLabelProps) {
  if (!children) {
    return;
  }
  return (
    <StyledLegend component="legend" {...props}>
      {children}
    </StyledLegend>
  );
}

const StyledHelperText = styled(FormHelperText, {
  shouldForwardProp(propName) {
    return propName !== "error";
  },
})<{ error?: boolean }>(({ error, theme }) => ({
  margin: "0.375rem 0 0 0",
  color: error ? theme.palette.danger.outlinedColor : undefined,
}));

function HelperText({
  children,
  ...props
}: FormHelperTextProps & { error?: boolean }) {
  if (!children) {
    return;
  }
  return <StyledHelperText {...props}>{children}</StyledHelperText>;
}
const PinDigit = styled(Input)(({ theme }) => ({
  flex: 1,
  minWidth: theme.spacing(4.5),
  maxWidth: theme.spacing(6),
  height: theme.spacing(5),
  textAlign: "center",
}));

const PinFieldset = styled("fieldset")(() => ({
  margin: 0,
  padding: 0,
  border: "none",
  outline: "none",
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
}));

export function parsePin(pin: string) {
  return pin.split("-").join("");
}
