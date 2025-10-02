/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Switch } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  BaseField,
  FieldComponentProps,
  FieldProps,
  useBaseField,
} from "@eshg/lib-portal";

// ToDo: @saschl replace old field or rename
interface SwitchFieldProps extends FieldProps<boolean>, FieldComponentProps {
  sx?: SxProps;
  ref?: (el: HTMLElement) => void;
}

export function SwitchField(props: SwitchFieldProps) {
  const FieldComponent = props.component ?? BaseField;
  const field = useBaseField<boolean>(props);

  return (
    <FieldComponent
      label={props.label}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        ...props.sx,
      }}
    >
      <Switch
        slotProps={{
          input: {
            ref: (el) => {
              if (el) {
                props.ref?.(el);
              }
            },
          },
        }}
        checked={field.input.value}
        sx={{
          "--Switch-trackRadius": "16px",
          "--Switch-trackHeight": "24px",
          "--Switch-trackWidth": "49px",
          "--Switch-thumbSize": "16px",
        }}
        onChange={(checked) => field.helpers.setValue(checked.target.checked)}
      />
    </FieldComponent>
  );
}
