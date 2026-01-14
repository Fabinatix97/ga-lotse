/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, BoxProps } from "@mui/joy";

export function Row({ children, ...props }: BoxProps) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      columnGap={(theme) => theme.spacing(2)}
      rowGap={(theme) => theme.spacing(1)}
      {...props}
    >
      {children}
    </Box>
  );
}
