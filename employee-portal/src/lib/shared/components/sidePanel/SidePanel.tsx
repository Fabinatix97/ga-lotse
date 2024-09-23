/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, Stack } from "@mui/joy";

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
