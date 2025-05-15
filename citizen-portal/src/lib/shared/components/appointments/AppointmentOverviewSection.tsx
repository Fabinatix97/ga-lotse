/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, GridProps, Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Children, ReactNode } from "react";

import { useIsMobile } from "@eshg/lib-portal/hooks/theme";
import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { byBreakpoint } from "@/lib/shared/breakpoints";

interface AppointmentOverviewSectionGridProps extends RequiresChildren {
  columns?: GridProps["columns"];
}

export function AppointmentOverviewSectionGrid({
  children,
  columns = byBreakpoint({ mobile: 1, desktop: 4 }),
}: AppointmentOverviewSectionGridProps) {
  const isMobile = useIsMobile();

  return (
    <Grid
      container
      spacing={2}
      columns={columns}
      sx={{ padding: isMobile ? 0 : "24px", flexGrow: 1 }}
    >
      {Children.map(children, (infoSection) => (
        <Grid xxs={1}>{infoSection}</Grid>
      ))}
    </Grid>
  );
}

interface AppointmentOverviewSectionProps extends RequiresChildren {
  icon?: ReactNode;
  sx?: SxProps;
}
export function AppointmentOverviewSection(
  props: Readonly<AppointmentOverviewSectionProps>,
) {
  return (
    <Stack component="section" direction="row" gap={2} sx={props.sx}>
      {props.icon}
      <Stack gap={0.5} sx={{ overflow: "hidden", flexGrow: 1 }}>
        {props.children}
      </Stack>
    </Stack>
  );
}

interface AppointmentOverviewSectionTitleProps extends RequiresChildren {
  "data-testid"?: string;
}

export function AppointmentOverviewSectionTitle(
  props: AppointmentOverviewSectionTitleProps,
) {
  return (
    <Typography
      level="title-md"
      sx={{ textAlign: "left" }}
      data-testid={props["data-testid"]}
    >
      {props.children}
    </Typography>
  );
}

export function AppointmentOverviewSectionText(
  props: AppointmentOverviewSectionTitleProps,
) {
  return (
    <Typography sx={{ textAlign: "left" }} data-testid={props["data-testid"]}>
      {props.children}
    </Typography>
  );
}
