/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, FormControl, Stack } from "@mui/joy";

import { BaseFieldProps, renderHelperText, renderLabel } from "./BaseField";

export function DecoratedInputField(props: BaseFieldProps) {
  const { label, helperText, fieldDecorator, children, ...formControlProps } =
    props;
  return (
    <FormControl
      required={formControlProps.required}
      error={formControlProps.error}
      sx={formControlProps.sx}
    >
      {renderLabel(label)}
      <Stack direction="row" alignItems="center" gap={2}>
        <Box width="100%">{children}</Box>
        {fieldDecorator}
      </Stack>
      {renderHelperText(helperText)}
    </FormControl>
  );
}
