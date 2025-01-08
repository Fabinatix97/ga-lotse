/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { ReactNode } from "react";

export function SidebarHeader({
  editButton,
  children,
}: Readonly<{
  editButton: ReactNode;
  children: ReactNode;
}>) {
  return (
    <Stack paddingTop={2} justifyContent="space-between" alignItems="center">
      <Stack flexDirection="column" gap={0.4}>
        {children}
      </Stack>
      <Stack gap={1}>{editButton}</Stack>
    </Stack>
  );
}
