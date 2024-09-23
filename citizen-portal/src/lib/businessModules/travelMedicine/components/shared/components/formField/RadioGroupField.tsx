/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { ValidationRules } from "@eshg/lib-portal/types/form";
import { InfoOutlined } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  Typography,
} from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ChangeEvent, PropsWithChildren, ReactNode } from "react";
import { isDefined } from "remeda";

export interface RadioGroupFieldProps
  extends ValidationRules<string>,
    PropsWithChildren {
  name: string;
  label?: string | ReactNode;
  sx?: SxProps;
  orientation?: "horizontal" | "vertical";
  onChange?: (newValue: string) => void;
  withErrorDecorator?: boolean;
}

export function RadioGroupField({
  sx,
  orientation,
  label,
  children,
  withErrorDecorator,
  ...props
}: RadioGroupFieldProps) {
  const { input, error, required, helpers } = useBaseField<string>(props);

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    await helpers.setValue(event.target.value);
    if (isDefined(props.onChange)) {
      props.onChange(event.target.value);
    }
  }

  return (
    <FormControl error={error} required={required}>
      <>
        {label && <FormLabel htmlFor={input.name}>{label}</FormLabel>}
        {error && (
          <FormHelperText>
            <Typography
              startDecorator={
                withErrorDecorator && <InfoOutlined fontSize="xl" />
              }
              level="body-md"
              color="danger"
            >
              {props.required}
            </Typography>
          </FormHelperText>
        )}
        <RadioGroup
          name={input.name}
          value={input.value}
          onChange={handleChange}
          orientation={orientation}
          sx={sx}
        >
          {children}
        </RadioGroup>
      </>
    </FormControl>
  );
}
