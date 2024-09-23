/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { PropsWithChildren } from "react";

export function InformationSheet({
  children,
  sx,
}: PropsWithChildren<{ sx?: SxProps }>) {
  return (
    <Sheet
      sx={{
        borderRadius: "lg",
        padding: 3,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <Stack
        flexDirection="column"
        flex="1 0px"
        gap={2}
        sx={{
          overflow: "auto",
          paddingRight: 2,
        }}
      >
        {children}
      </Stack>
    </Sheet>
  );
}
