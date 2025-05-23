/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sheet } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { RequiresChildren } from "@eshg/lib-portal";

interface BottomToolbarProps extends RequiresChildren {
  sx?: SxProps;
}

export function BottomToolbar(props: BottomToolbarProps) {
  return (
    <Sheet
      sx={{ borderRadius: 0, borderWidth: 0, borderTopWidth: 1, ...props.sx }}
    >
      {props.children}
    </Sheet>
  );
}
