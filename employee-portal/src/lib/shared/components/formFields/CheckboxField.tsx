/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { Checkbox, CheckboxProps, FormControl, FormHelperText } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEventHandler } from "react";

export interface CheckboxFieldProps extends FieldProps<boolean> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  representingValue?: string;
  size?: CheckboxProps["size"];
  variant?: CheckboxProps["variant"];
  sx?: SxProps;
  "aria-label"?: string;
}

function isChecked(
  value: string | number | readonly string[],
  representingValue?: string,
): boolean {
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
  } = useBaseField<number | string | readonly string[]>({
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

  const showHelperText = !!meta.error && props.required;
  return (
    <FormControl error={!!meta.error} required={required}>
      <Checkbox
        name={field.name}
        onChange={(event) => {
          field.onChange(event);
          if (props.onChange != null) {
            props.onChange(event);
          }
        }}
        onBlur={field.onBlur}
        label={props.label}
        disabled={props.disabled}
        checked={isChecked(field.value, props.representingValue)}
        value={props.representingValue ?? "true"}
        size={props.size}
        required={required}
        variant={props.variant}
        sx={props.sx}
        slotProps={{
          input: { "aria-label": props["aria-label"] },
        }}
      />
      {showHelperText ? (
        <FormHelperText>{props.required}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
