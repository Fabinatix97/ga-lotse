/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

const ButtonStack = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export function FieldButtonBar({
  children,
  sx,
}: { sx?: SxProps } & RequiresChildren) {
  return (
    <ButtonStack direction="row" gap={2} sx={sx}>
      {children}
    </ButtonStack>
  );
}
