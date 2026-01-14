/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ToggleButtonGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { useId } from "react";

import {
  BaseField,
  FieldProps,
  SelectOption,
  useBaseField,
} from "@eshg/lib-portal";

export interface ToggleButtonGroupFieldProps extends FieldProps<string> {
  options: SelectOption[];
  sx?: SxProps;
  disabled?: boolean;
}

export function ToggleButtonGroupField(props: ToggleButtonGroupFieldProps) {
  const field = useBaseField<string>(props);
  const labelId = useId();

  return (
    <BaseField
      label={props.label}
      labelId={labelId}
      helperText={field.helperText}
      required={field.required}
      error={field.error}
      sx={props.sx}
    >
      <ToggleButtonGroup
        value={field.input.value}
        disabled={props.disabled}
        variant="outlined"
        color="primary"
        sx={{ width: "100%" }}
        slotProps={{
          root: {
            "aria-labelledby": labelId,
          },
        }}
        onChange={(_, newValue) => {
          if (!newValue) {
            return;
          }

          void field.helpers.setValue(newValue);
        }}
      >
        {props.options.map((it) => (
          <Button key={it.label} value={it.value} sx={{ width: "100%" }}>
            {it.label}
          </Button>
        ))}
      </ToggleButtonGroup>
    </BaseField>
  );
}
