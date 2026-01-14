/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { RequiresChildren } from "@eshg/lib-portal";

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
