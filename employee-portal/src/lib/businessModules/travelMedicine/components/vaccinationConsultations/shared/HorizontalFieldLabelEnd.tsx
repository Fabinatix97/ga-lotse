/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseFieldProps,
  renderHelperText,
  renderLabel,
} from "@eshg/lib-portal/components/formFields/BaseField";
import { FormControl, Stack, styled } from "@mui/joy";

const StyledFormControl = styled(FormControl)({
  flexDirection: "column",
});

export function HorizontalFieldLabelEnd(props: BaseFieldProps) {
  const {
    label,
    helperText,
    children,
    fieldDecorator: _,
    ...formControlProps
  } = props;

  return (
    <StyledFormControl orientation="horizontal" {...formControlProps}>
      <Stack direction="row" alignContent="center" gap={"8px"}>
        {children}
        {renderLabel(label)}
      </Stack>
      {renderHelperText(helperText)}
    </StyledFormControl>
  );
}
