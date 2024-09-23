/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { SelectOption } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { Button, ToggleButtonGroup } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

interface ToggleButtonGroupFieldProps extends FieldProps<string> {
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
        onChange={(_, newValue) => {
          if (!newValue) {
            return;
          }

          void field.helpers.setValue(newValue);
        }}
        variant="outlined"
        sx={{ width: "100%" }}
      >
        {props.options.map((it) => (
          <Button
            key={it.label}
            value={it.value}
            sx={{ width: "100%" }}
            color="primary"
          >
            {it.label}
          </Button>
        ))}
      </ToggleButtonGroup>
    </BaseField>
  );
}
