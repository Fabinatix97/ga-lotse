/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isNonNullish } from "remeda";

import { useIsFormDisabled } from "../form/DisabledFormContext";
import { YearInput } from "../inputs/YearInput";

import { BaseField, BaseFieldProps, useBaseField } from "./BaseField";

interface YearFieldProps {
  name: string;
  label?: string;
  fieldDecorator?: ReactNode;
  min?: number;
  max?: number;
  component?: (props: BaseFieldProps) => ReactNode;
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
  });
  const FieldComponent = component ?? BaseField;
  const disabled = useIsFormDisabled();

  return (
    <FieldComponent label={label} {...field}>
      <Stack direction="row" spacing={1}>
        <YearInput sx={sx} {...field.input} disabled={disabled} />
        {fieldDecorator}
      </Stack>
    </FieldComponent>
  );
}
