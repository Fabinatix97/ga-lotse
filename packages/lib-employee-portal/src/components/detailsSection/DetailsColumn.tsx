/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types/theme";

import { RequiresChildren } from "@eshg/lib-portal";

interface DetailsColumnProps extends RequiresChildren {
  gap?: number;
  sx?: SxProps;
}

export function DetailsColumn(props: Readonly<DetailsColumnProps>) {
  return (
    <Stack gap={props.gap ?? 1} flex={1} minWidth={0} sx={props.sx}>
      {props.children}
    </Stack>
  );
}
