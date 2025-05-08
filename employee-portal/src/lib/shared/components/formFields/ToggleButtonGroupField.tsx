/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, ToggleButtonGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { FieldProps } from "@eshg/lib-portal/types/form";

export interface ToggleButtonGroupFieldProps extends FieldProps<string> {
  options: SelectOption[];
  sx?: SxProps;
  disabled?: boolean;
}

export function ToggleButtonGroupField(props: ToggleButtonGroupFieldProps) {
  const field = useBaseField<string>(props);

  return (
    <BaseField
      label={props.label}
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
