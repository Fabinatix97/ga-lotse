/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, StackProps } from "@mui/joy";
import { ReactNode } from "react";

interface DetailsRowProps {
  rowGap?: number;
  columnGap?: number;
  children: ReactNode[];
  alignItems?: StackProps["alignItems"];
}

export function DetailsRow(props: DetailsRowProps) {
  return (
    <Stack
      direction="row"
      columnGap={props.columnGap ?? 3}
      rowGap={props.rowGap ?? 1}
      flexWrap="wrap"
      alignItems={props.alignItems ?? "stretch"}
    >
      {props.children}
    </Stack>
  );
}
