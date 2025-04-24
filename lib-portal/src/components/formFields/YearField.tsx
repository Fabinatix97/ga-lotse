/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isNonNullish } from "remeda";

import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";
import { YearInput } from "../inputs/YearInput";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { StyledInputProps } from "./types";

interface YearFieldProps
  extends Omit<FieldProps<number>, "label">,
    FieldComponentProps,
    StyledInputProps {
  label?: string;
  min?: number;
  max?: number;
  sx?: SxProps;
}

export function YearField({
  label,
  name,
  fieldDecorator,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  component,
  sx,
  ...props
}: YearFieldProps) {
  const field = useBaseField<number>({
    name: name,
    type: "number",
    validate: (input) => {
      if (isNonNullish(input) && (input < min || input > max)) {
        return `Bitte ein Jahr zwischen ${min} und ${max} eingeben`;
      }
      return undefined;
    },
    ...props,
  });
  const FieldComponent = component ?? BaseField;
  const disabled = useIsFormDisabled();

  return (
    <FieldComponent label={label} disabled={disabled} {...field}>
      <Stack direction="row" spacing={1}>
        <YearInput sx={sx} {...field.input} disabled={disabled} />
        {fieldDecorator}
      </Stack>
    </FieldComponent>
  );
}
