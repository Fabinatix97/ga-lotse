/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, styled } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

const StyledButton = styled(Button)<{ width: number }>(({ theme, width }) => ({
  padding: theme.spacing(0.5, 3.5),
  width,
  "&[aria-pressed='true']": {
    color: theme.vars.palette.primary.solidColor,
    backgroundColor: theme.vars.palette.primary.solidBg,
  },
}));

interface TestValueButtonProps extends RequiresChildren {
  value: string;
  buttonWidth: number;
}

export function TestValueButton(props: TestValueButtonProps) {
  return (
    <StyledButton value={props.value} width={props.buttonWidth}>
      {props.children}
    </StyledButton>
  );
}
