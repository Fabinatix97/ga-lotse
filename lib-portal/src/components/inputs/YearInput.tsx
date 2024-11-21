/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input, InputProps } from "@mui/joy";

type YearInputProps = Omit<InputProps, "endDecorator" | "placeholder">;

export function YearInput(props: YearInputProps) {
  const { sx, ...inputProps } = props;
  return (
    <Input
      type="number"
      placeholder="JJJJ"
      sx={{ color: "black", flexGrow: 1, ...sx }}
      {...inputProps}
    />
  );
}
