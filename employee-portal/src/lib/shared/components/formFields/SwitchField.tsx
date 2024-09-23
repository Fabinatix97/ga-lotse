/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BaseField,
  useBaseField,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { FieldProps } from "@eshg/lib-portal/types/form";
import { Switch } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

interface SwitchFieldProps extends FieldProps<boolean> {
  sx?: SxProps;
}

export function SwitchField(props: SwitchFieldProps) {
  const field = useBaseField<boolean>(props);

  return (
    <BaseField
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
        size="lg"
        checked={field.input.value}
        onChange={(checked) => field.helpers.setValue(checked.target.checked)}
      />
    </BaseField>
  );
}
