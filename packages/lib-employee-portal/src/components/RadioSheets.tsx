/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Radio, Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { PropsWithChildren, useId } from "react";
import { isDefined } from "remeda";

import { RadioGroupField, RadioGroupFieldProps, Row } from "@eshg/lib-portal";

export function RadioSheets({ children, ...props }: RadioGroupFieldProps) {
  return (
    <RadioGroupField {...props}>
      <Stack gap={2}>{children}</Stack>
    </RadioGroupField>
  );
}

interface RadioSheetOptionProps {
  value: string;
  name: string;
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
}
export function RadioSheetOption({
  value,
  name,
  children,
  label,
  onSelect,
  disabled,
}: PropsWithChildren<RadioSheetOptionProps>) {
  const { getFieldMeta, setFieldValue } = useFormikContext();
  const { value: formValue } = getFieldMeta(name);
  const isSelected = value === formValue;
  const radioId = useId();
  const labelId = useId();

  return (
    <Sheet
      aria-describedby={labelId}
      aria-current={isSelected}
      sx={(theme) => ({
        background: isSelected ? theme.palette.primary.softBg : null,
        borderColor: isSelected
          ? theme.palette.a11y.primary
          : theme.palette.a11y.neutral,
        opacity: disabled ? 0.75 : 1,
      })}
      onClick={() => {
        if (disabled || isSelected) {
          return;
        }
        if (isDefined(onSelect)) {
          onSelect();
        }
        void setFieldValue(name, value);
      }}
    >
      <Row>
        <Radio
          color={isSelected ? "primary" : "neutral"}
          id={radioId}
          sx={{ flexBasis: "max-content" }}
          name={name}
          value={value}
          disabled={disabled}
        />
        <Stack>
          <RadioButtonLabel id={labelId} htmlFor={radioId} label={label} />
          <Row justifyContent="center" flex={1}>
            {isSelected ? children : undefined}
          </Row>
        </Stack>
      </Row>
    </Sheet>
  );
}

function RadioButtonLabel({
  htmlFor,
  label,
  id,
}: {
  htmlFor: string;
  label: string;
  id: string;
}) {
  return (
    <Typography id={id} component="label" htmlFor={htmlFor}>
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
  );
}
