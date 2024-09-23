/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Stack } from "@mui/joy";
import { PropsWithChildren } from "react";

import { mainLayoutMarginBottom } from "@/lib/components/layout/theme/sizes";
import { theme } from "@/lib/components/layout/theme/theme";

export function Content({ children }: Readonly<PropsWithChildren>) {
  return (
    <Stack
      component="main"
      flexDirection="column"
      flex="1"
      minWidth="0"
      sx={{
        marginBottom: mainLayoutMarginBottom,
        paddingBlock: theme.spacing(3),
        marginInline: theme.spacing(3),
      }}
    >
      {children}
    </Stack>
  );
}
