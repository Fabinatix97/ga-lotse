/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sheet, Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

interface ContentPanelProps extends RequiresChildren {
  dense?: boolean;
  testId?: string;
  role?: string;
  ariaLabel?: string;
}

export function ContentPanel(props: ContentPanelProps) {
  return (
    <Sheet
      data-testid={props.testId ?? "contentPanel"}
      role={props.role}
      aria-label={props.ariaLabel}
    >
      <Stack gap={props.dense ? 2 : 3}>{props.children}</Stack>
    </Sheet>
  );
}
