/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types/theme";
import { PropsWithChildren } from "react";

export function DetailsColumn(
  props: Readonly<PropsWithChildren<{ sx?: SxProps }>>,
) {
  return (
    <Stack gap={1} flex={1} minWidth={0} sx={props.sx}>
      {props.children}
    </Stack>
  );
}
