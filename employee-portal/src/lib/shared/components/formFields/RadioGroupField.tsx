/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useBaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { ValidationRules } from "@eshg/lib-portal/types/form";
import { FormControl, FormHelperText, FormLabel, RadioGroup } from "@mui/joy";
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
}

export function RadioGroupField({
  sx,
  orientation,
  label,
  children,
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
    <FormControl error={error} required={required} sx={sx}>
      <>
        {label && <FormLabel htmlFor={input.name}>{label}</FormLabel>}
        <RadioGroup
          name={input.name}
          value={input.value}
          onChange={handleChange}
          orientation={orientation}
        >
          {children}
        </RadioGroup>
        {error && <FormHelperText>{props.required}</FormHelperText>}
      </>
    </FormControl>
  );
}
