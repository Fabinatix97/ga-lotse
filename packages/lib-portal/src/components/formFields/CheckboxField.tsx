/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Checkbox, CheckboxProps, FormControl } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormikHandlers, useFormikContext } from "formik";
import { ChangeEventHandler, memo } from "react";
import { isString } from "remeda";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";

import { renderHelperText, useBaseField } from "./BaseField";

export interface CheckboxFieldProps extends FieldProps<ValueType> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  representingValue?: string;
  size?: CheckboxProps["size"];
  variant?: CheckboxProps["variant"];
  sx?: SxProps;
  slotProps?: CheckboxProps["slotProps"];
  "aria-label"?: string;
  readonly?: boolean;
}

type ValueType = boolean | number | string | readonly string[];

function isChecked(value: ValueType, representingValue?: string): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  const values = value instanceof Array ? value : [`${value}`];
  return values.includes(representingValue ?? "true");
}

export function CheckboxField(props: CheckboxFieldProps) {
  const {
    input: field,
    required,
    meta,
  } = useBaseField<ValueType>({
    name: props.name,
    required: props.required,
    type: "checkbox",
    validate: (v) => {
      if (isChecked(v, props.representingValue)) {
        return;
      }
      return props.required;
    },
  });
  const { isValid } = useFormikContext();

  return (
    <MemoizedCheckboxField
      {...props}
      fieldName={field.name}
      fieldValue={field.value}
      fieldOnChange={field.onChange}
      fieldOnBlur={field.onBlur}
      fieldRequired={required}
      metaError={meta.error}
      isValid={isValid}
    />
  );
}

interface InnerCheckboxFieldProps extends CheckboxFieldProps {
  fieldName: string;
  fieldValue: ValueType;
  fieldOnChange: FormikHandlers["handleChange"];
  fieldOnBlur: FormikHandlers["handleBlur"];
  fieldRequired: boolean;
  metaError?: string;
  isValid: boolean;
}

const MemoizedCheckboxField = memo(function InnerCheckboxField({
  fieldName,
  fieldValue,
  fieldOnChange,
  fieldOnBlur,
  fieldRequired,
  metaError,
  isValid,
  ...props
}: InnerCheckboxFieldProps) {
  const disabled = useIsFormDisabled() || props.disabled;

  const starLabel =
    isString(props.label) && props.required ? `${props.label} *` : props.label;

  const hasValidationError = !!metaError && !isValid;

  // Often checkbox helper text is shown for a whole group,
  // only show for single checkbox if the checkbox is "required"
  const showHelperText = hasValidationError && props.required !== undefined;

  return (
    <FormControl error={hasValidationError} required={fieldRequired}>
      <Checkbox
        name={fieldName}
        label={starLabel}
        disabled={disabled}
        checked={isChecked(fieldValue, props.representingValue)}
        value={props.representingValue ?? "true"}
        size={props.size}
        required={fieldRequired}
        variant={props.variant}
        sx={props.sx}
        slotProps={{
          input: { "aria-label": props["aria-label"] },
          ...props.slotProps,
        }}
        onChange={(event) => {
          fieldOnChange(event);
          if (props.onChange !== undefined) {
            props.onChange(event);
          }
        }}
        onBlur={fieldOnBlur}
      />
      {showHelperText && renderHelperText(props.required)}
    </FormControl>
  );
});
