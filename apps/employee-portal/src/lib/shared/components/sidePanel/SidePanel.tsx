/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sheet, Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

interface SidePanelProps extends RequiresChildren {
  "data-testid"?: string;
  role?: string;
  ariaLablledby?: string;
}

export function SidePanel(props: SidePanelProps) {
  return (
    <Sheet
      data-testid={props["data-testid"] ?? "sidePanel"}
      role={props.role}
      aria-labelledby={props.ariaLablledby}
    >
      <Stack gap={1}>{props.children}</Stack>
    </Sheet>
  );
}
