/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, GridProps, Stack } from "@mui/joy";
import { ReactNode } from "react";

function responsiveColumns(
  desktopBreakpoint: number,
  mobileBreakpoint = desktopBreakpoint,
) {
  return {
    xxs: mobileBreakpoint,
    sm: desktopBreakpoint,
  } satisfies GridProps;
}

const GRID_COLUMNS = responsiveColumns(3, 1);
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
      <Grid {...responsiveColumns(2, 1)}>{props.content}</Grid>
      <Grid {...responsiveColumns(1)}>{props.sidePanel}</Grid>
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
      <Grid {...responsiveColumns(1)}>{props.contentLeft}</Grid>
      <Grid {...responsiveColumns(1)}>{props.contentRight}</Grid>
      <Grid {...responsiveColumns(1)}>{props.sidePanel}</Grid>
    </Grid>
  );
}

interface OneColumnGridProps {
  contentTop: ReactNode;
  contentCenter: ReactNode;
  contentBottom: ReactNode;
}

export function OneColumnGrid(props: OneColumnGridProps) {
  return (
    <Grid container columns={GRID_COLUMNS} spacing={GRID_SPACING}>
      <Grid {...responsiveColumns(1)}>{props.contentTop}</Grid>
      <Grid {...responsiveColumns(1)}>{props.contentCenter}</Grid>
      <Grid {...responsiveColumns(1)}>{props.contentBottom}</Grid>
    </Grid>
  );
}
