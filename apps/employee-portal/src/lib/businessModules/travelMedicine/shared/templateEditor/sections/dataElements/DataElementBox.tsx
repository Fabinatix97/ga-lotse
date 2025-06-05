/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

interface DataElementBoxProps extends RequiresChildren {
  "data-testid"?: string;
}

export function DataElementBox(props: Readonly<DataElementBoxProps>) {
  return (
    <Box
      boxShadow="sm"
      border="1px solid var(--neutral-outlined-border, #CDD7E1)"
      borderRadius={12}
      component="section"
      flex={1}
      sx={{
        padding: 1.5,
        background: "var(--background-level-1, #F0F4F8)",
      }}
      data-testid={props["data-testid"]}
    >
      {props.children}
    </Box>
  );
}
