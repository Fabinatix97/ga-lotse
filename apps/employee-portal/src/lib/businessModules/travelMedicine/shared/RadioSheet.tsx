/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Radio,
  RadioProps,
  Sheet,
  Stack,
  Typography,
  radioClasses,
} from "@mui/joy";
import { useFormikContext } from "formik";
import { PropsWithChildren, useId } from "react";
import { isDefined } from "remeda";

import { RadioGroupField, RadioGroupFieldProps } from "@eshg/lib-portal";

export function RadioSheet({ children, ...props }: RadioGroupFieldProps) {
  return (
    <RadioGroupField {...props}>
      <Stack gap={2}>{children}</Stack>
    </RadioGroupField>
  );
}

interface RadioSheetOptionProps extends Pick<RadioProps, "disabled"> {
  value: string;
  name: string;
  label: string;
}

export function RadioSheetOption({
  value,
  name,
  children,
  label,
  disabled,
}: PropsWithChildren<RadioSheetOptionProps>) {
  const { getFieldMeta, setFieldValue } = useFormikContext();
  const { value: formValue } = getFieldMeta(name);

  const isSelected = value === formValue;
  const radioId = useId();

  return (
    <Sheet
      aria-describedby={`${radioId}-label`}
      sx={(theme) => ({
        display: "flex",
        borderRadius: "md",
        gap: 2,
        borderColor: isSelected
          ? theme.palette.a11y.primary
          : theme.palette.a11y.neutral,
        [`:has(> .${radioClasses.disabled})`]: {
          backgroundColor: "whitesmoke",
          borderColor: theme.palette.neutral[100],
          opacity: 0.75,
        },
      })}
      aria-current={isSelected}
      onClick={() => {
        if (disabled || isSelected) {
          return;
        }
        void setFieldValue(name, value);
      }}
    >
      <Radio
        id={radioId}
        sx={{
          flexBasis: "max-content",
        }}
        name={name}
        value={value}
        disabled={disabled}
      />
      <Stack sx={{ width: "100%" }}>
        <Typography
          component="label"
          id={`${radioId}-label`}
          htmlFor={radioId}
          sx={{ m: 0 }}
        >
          <Typography
            component="span"
            level="title-md"
            sx={(theme) => ({
              fontWeight: theme.fontWeight.lg,
              fontSize: theme.fontSize.md,
            })}
          >
            {label}
          </Typography>
        </Typography>
        {isDefined(children) && (
          <Stack direction="row" sx={{ pt: 1 }}>
            {children}
          </Stack>
        )}
      </Stack>
    </Sheet>
  );
}
