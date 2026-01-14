/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

export const chatColumnHeaderHeight = "5.25rem";
export const chatMessageInputHeight = "5rem";

export function ChatColumnHeaderWrapper({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <Stack
      justifyContent="center"
      sx={{
        height: chatColumnHeaderHeight,
        borderBottom: "1px solid",
        borderColor: "neutral.outlinedBorder",
        paddingX: { xxs: 1, sm: 3 },
        flexShrink: 0,
      }}
    >
      {children}
    </Stack>
  );
}
