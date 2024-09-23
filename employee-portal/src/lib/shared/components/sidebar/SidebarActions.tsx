/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Divider, Stack } from "@mui/joy";
import { ReactNode } from "react";

export interface SidebarActionsProps {
  children?: ReactNode;
}

export function SidebarActions({ children }: SidebarActionsProps) {
  return (
    <Stack sx={{ paddingTop: 3 }} data-testid="sidebarActions">
      {children && <Divider sx={{ marginBottom: 3, marginInline: -3 }} />}
      {children}
    </Stack>
  );
}
