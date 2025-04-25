/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Radio, Sheet, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";
import { PropsWithChildren, useId } from "react";

import { Row } from "@eshg/lib-portal/components/Row";
import {
  RadioGroupField,
  RadioGroupFieldProps,
} from "@eshg/lib-portal/components/formFields/RadioGroupField";

export function RadioSheets({ children, ...props }: RadioGroupFieldProps) {
  return (
    <RadioGroupField {...props}>
      <Stack gap={2}>{children}</Stack>
    </RadioGroupField>
  );
}

export interface RadioSheetOptionProps {
  value: string;
  name: string;
  label: string;
}
export function RadioSheetOption({
  value,
  name,
  children,
  label,
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
        borderColor: isSelected ? theme.palette.primary[300] : null,
      })}
      onClick={() => {
        if (isSelected) {
          return;
        }
        void setFieldValue(name, value);
      }}
    >
      <Row>
        <Radio
          id={radioId}
          sx={{ flexBasis: "max-content" }}
          name={name}
          value={value}
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
