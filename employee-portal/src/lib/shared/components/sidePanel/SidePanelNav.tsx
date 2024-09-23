/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { ButtonProps, Stack } from "@mui/joy";

export function getSidePanelNavItemStyles(isActive: boolean) {
  return {
    variant: isActive ? "soft" : "outlined",
    color: isActive ? "primary" : "neutral",
    sx: {
      justifyContent: "flex-start",
    },
  } satisfies ButtonProps;
}

export function SidePanelNav(props: RequiresChildren) {
  return (
    <Stack component="nav" aria-label="Seitenpanel-Navigation" gap={1}>
      {props.children}
    </Stack>
  );
}
