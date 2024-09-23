/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, Stack, Typography, TypographyProps } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Children, ReactNode } from "react";

import { useIsMobile } from "@/lib/businessModules/travelMedicine/shared/useIsMobile";

export function AppointmentOverviewSectionGrid(
  props: Readonly<RequiresChildren>,
) {
  const isMobile = useIsMobile();

  return (
    <Grid
      container
      spacing={2}
      columns={{ xxs: 1, md: 4 }}
      sx={{ padding: isMobile ? 0 : "24px", flexGrow: 1 }}
    >
      {Children.map(props.children, (infoSection) => (
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

interface AppointmentOverviewSectionTitleProps
  extends Pick<TypographyProps, "component">,
    RequiresChildren {
  "data-testid"?: string;
}

export function AppointmentOverviewSectionTitle(
  props: AppointmentOverviewSectionTitleProps,
) {
  return (
    <Typography
      component={props.component ?? "h4"}
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
