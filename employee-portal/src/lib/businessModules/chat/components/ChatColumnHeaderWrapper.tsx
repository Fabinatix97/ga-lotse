/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, useTheme } from "@mui/joy";
import { ReactNode } from "react";

export const chatColumnHeaderHeight = "5.25rem";

export function ChatColumnHeaderWrapper({
  children,
}: {
  children?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <Stack
      justifyContent="center"
      sx={{
        height: chatColumnHeaderHeight,
        borderBottom: "1px solid",
        borderColor: theme.palette.neutral.outlinedBorder,
        paddingX: theme.spacing(3),
      }}
    >
      {children}
    </Stack>
  );
}
