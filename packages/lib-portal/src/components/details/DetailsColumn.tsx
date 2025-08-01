/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";

import { RequiresChildren } from "../../types/react";

interface DetailsColumnProps extends RequiresChildren {
  gap?: number;
  sx?: SxProps;
}

export function DetailsColumn(props: Readonly<DetailsColumnProps>) {
  return (
    <Stack
      gap={props.gap ?? 1}
      flex={1}
      direction="column"
      minWidth={0}
      sx={props.sx}
    >
      {props.children}
    </Stack>
  );
}
