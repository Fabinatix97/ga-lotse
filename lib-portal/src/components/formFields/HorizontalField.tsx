/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormControl, Stack, styled } from "@mui/joy";

import { BaseFieldProps, renderHelperText, renderLabel } from "./BaseField";

const StyledFormControl = styled(FormControl)({
  flexDirection: "column",
});

export function HorizontalField(props: BaseFieldProps) {
  const { label, helperText, children, ...formControlProps } = props;

  return (
    <StyledFormControl orientation="horizontal" {...formControlProps}>
      <Stack direction="row" alignContent="center">
        {renderLabel(label)}
        {children}
      </Stack>
      {renderHelperText(helperText)}
    </StyledFormControl>
  );
}
