/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

import { allBreakpoints, byBreakpoint } from "@/lib/shared/breakpoints";

const GRID_COLUMNS = byBreakpoint({ mobile: 1, desktop: 3 });
const GRID_SPACING = 2;

interface TwoColumnGridProps {
  content: ReactNode;
  sidePanel: ReactNode;
}

export function GridColumnStack(props: RequiresChildren) {
  return <Stack gap={GRID_SPACING}>{props.children}</Stack>;
}

export function TwoColumnGrid(props: TwoColumnGridProps) {
  return (
    <Grid container columns={GRID_COLUMNS} spacing={GRID_SPACING}>
      <Grid {...byBreakpoint({ mobile: 1, desktop: 2 })}>{props.content}</Grid>
      <Grid {...allBreakpoints(1)}>{props.sidePanel}</Grid>
    </Grid>
  );
}

interface ThreeColumnGridProps {
  contentLeft: ReactNode;
  contentRight: ReactNode;
  sidePanel: ReactNode;
}

export function ThreeColumnGrid(props: ThreeColumnGridProps) {
  return (
    <Grid container columns={GRID_COLUMNS} spacing={GRID_SPACING}>
      <Grid {...allBreakpoints(1)}>{props.contentLeft}</Grid>
      <Grid {...allBreakpoints(1)}>{props.contentRight}</Grid>
      <Grid {...allBreakpoints(1)}>{props.sidePanel}</Grid>
    </Grid>
  );
}

interface OneColumnGridProps {
  contentTop: ReactNode;
  contentCenter: ReactNode;
  contentBottom?: ReactNode;
}

export function OneColumnGrid(props: OneColumnGridProps) {
  return (
    <Grid container columns={GRID_COLUMNS} spacing={GRID_SPACING}>
      <Grid {...allBreakpoints(1)}>{props.contentTop}</Grid>
      <Grid {...allBreakpoints(1)}>{props.contentCenter}</Grid>
      {props.contentBottom && (
        <Grid {...allBreakpoints(1)}>{props.contentBottom}</Grid>
      )}
    </Grid>
  );
}
