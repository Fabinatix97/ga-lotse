/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Input, InputProps } from "@mui/joy";

export function YearInput(props: InputProps) {
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
