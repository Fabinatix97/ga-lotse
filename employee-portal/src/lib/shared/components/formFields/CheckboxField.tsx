/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FieldProps } from "@eshg/lib-portal/types/form";
import { Checkbox, CheckboxProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useField } from "formik";
import { ChangeEventHandler } from "react";
import { isDefined, isString } from "remeda";

export interface CheckboxFieldProps extends FieldProps<boolean> {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  // represents the value of the checkbox as string (see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value)
  representingValue?: string;
  size?: CheckboxProps["size"];
  variant?: CheckboxProps["variant"];
  sx?: SxProps;
  "aria-label"?: string;
}

export function CheckboxField(props: CheckboxFieldProps) {
  const [field] = useField<boolean | string>({
    name: props.name,
    value: props.representingValue,
    type: "checkbox",
  });

  return (
    <Checkbox
      name={field.name}
      onChange={(event) => {
        field.onChange(event);
        if (isDefined(props.onChange)) {
          props.onChange(event);
        }
      }}
      onBlur={field.onBlur}
      checked={field.checked}
      label={props.label}
      disabled={props.disabled}
      value={isString(field.value) ? field.value : undefined}
      size={props.size}
      variant={props.variant}
      sx={props.sx}
      slotProps={{
        input: { "aria-label": props["aria-label"] },
      }}
    />
  );
}
