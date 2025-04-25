/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Checkbox, CheckboxProps, FormControl, FormHelperText } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { FormikHandlers, useFormikContext } from "formik";
import { ChangeEventHandler, memo } from "react";
import { isString } from "remeda";

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";

export interface CheckboxFieldProps extends FieldProps<boolean> {
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
  if (value == null) {
    return false;
  }
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
  const showHelperText = hasValidationError && props.required != null;

  return (
    <FormControl error={hasValidationError} required={fieldRequired}>
      <Checkbox
        name={fieldName}
        onChange={(event) => {
          fieldOnChange(event);
          if (props.onChange != null) {
            props.onChange(event);
          }
        }}
        onBlur={fieldOnBlur}
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
      />
      {showHelperText ? (
        <FormHelperText>{props.required}</FormHelperText>
      ) : null}
    </FormControl>
  );
});
