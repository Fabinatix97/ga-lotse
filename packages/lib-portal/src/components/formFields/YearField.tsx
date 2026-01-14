/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { isNonNullish } from "remeda";

import { useTranslation } from "../../i18n/useTranslation";
import { FieldProps } from "../../types/form";
import { useIsFormDisabled } from "../form/DisabledFormContext";
import { YearInput } from "../inputs/YearInput";

import { BaseField, FieldComponentProps, useBaseField } from "./BaseField";
import { FieldVariantProps } from "./types";

interface YearFieldProps
  extends Omit<FieldProps<number>, "label">,
    FieldComponentProps,
    FieldVariantProps {
  label?: string;
  min?: number;
  max?: number;
  sx?: SxProps;
  ref?: (el: HTMLInputElement) => void;
}

export function YearField({
  label,
  name,
  fieldDecorator,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  component,
  sx,
  ref,
  ...props
}: YearFieldProps) {
  const { t } = useTranslation();
  const field = useBaseField<number>({
    name: name,
    type: "number",
    validate: (input) => {
      if (isNonNullish(input) && (input < min || input > max)) {
        return t("validation.pleaseEnterYearInRange", { min, max });
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
        <YearInput
          slotProps={{
            input: {
              ref: ref,
            },
          }}
          sx={sx}
          {...field.input}
          disabled={disabled}
        />
        {fieldDecorator}
      </Stack>
    </FieldComponent>
  );
}
