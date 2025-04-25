/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sheet, Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

interface SidePanelProps extends RequiresChildren {
  "data-testid"?: string;
}

export function SidePanel(props: SidePanelProps) {
  return (
    <Sheet data-testid={props["data-testid"] ?? "sidePanel"}>
      <Stack gap={1}>{props.children}</Stack>
    </Sheet>
  );
}
