/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, Stack } from "@mui/joy";

interface ContentPanelProps extends RequiresChildren {
  dense?: boolean;
  testId?: string;
}

export function ContentPanel(props: ContentPanelProps) {
  return (
    <Sheet data-testid={props.testId ?? "contentPanel"}>
      <Stack gap={props.dense ? 2 : 3}>{props.children}</Stack>
    </Sheet>
  );
}
