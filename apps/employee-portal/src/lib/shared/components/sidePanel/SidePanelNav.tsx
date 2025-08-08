/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonProps, Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

export function getSidePanelNavItemStyles(isActive: boolean) {
  return {
    variant: isActive ? "soft" : "outlined",
    color: isActive ? "primary" : "neutral",
    sx: {
      justifyContent: "flex-start",
    },
  } satisfies ButtonProps;
}

export function SidePanelNav(props: RequiresChildren & { role?: string }) {
  return (
    <Stack gap={1} role={props.role}>
      {props.children}
    </Stack>
  );
}
