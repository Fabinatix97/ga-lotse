/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

interface ProofTabEntryProps {
  children: ReactNode;
  rowLayout?: boolean;
}
export function ProofTabEntry({
  children,
  rowLayout,
}: Readonly<ProofTabEntryProps>) {
  return (
    <Stack
      gap={3}
      flexDirection={rowLayout ? "row" : "column"}
      sx={(theme) => ({
        flexBasis: "auto",
        background: theme.palette.background.level1,
        borderRadius: theme.radius.md,
        padding: {
          xxs: theme.spacing(2),
        },
        width: "100%",
        flexWrap: "wrap",
      })}
    >
      {children}
    </Stack>
  );
}
