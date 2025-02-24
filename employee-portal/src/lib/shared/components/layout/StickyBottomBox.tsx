/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Box } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

interface StickyBottomBoxProps extends RequiresChildren {
  sx?: SxProps;
}

export function StickyBottomBox(props: StickyBottomBoxProps) {
  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: (theme) => theme.zIndex.toolbar,
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
}
