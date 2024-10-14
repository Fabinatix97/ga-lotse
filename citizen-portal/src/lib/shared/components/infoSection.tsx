/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, Stack, Typography, TypographyProps, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Children, ReactNode } from "react";

import { byBreakpoint } from "@/lib/shared/breakpoints";

export function InfoSectionGrid(props: RequiresChildren) {
  return (
    <Grid
      container
      spacing={2}
      columns={byBreakpoint({ mobile: 1, desktop: 2 })}
    >
      {Children.map(props.children, (infoSection) => (
        <Grid xxs={1}>{infoSection}</Grid>
      ))}
    </Grid>
  );
}

const SectionStack = styled(Stack)({
  ".MuiSvgIcon-root": {
    height: "24px",
    width: "24px",
    marginTop: "0rem",
  },
}) as typeof Stack;

interface InfoSectionProps extends RequiresChildren {
  icon?: ReactNode;
  sx?: SxProps;
}

export function InfoSection(props: InfoSectionProps) {
  return (
    <SectionStack component="section" direction="row" gap={2} sx={props.sx}>
      {props.icon}
      <Stack gap={0.5} sx={{ overflow: "hidden", flexGrow: 1 }}>
        {props.children}
      </Stack>
    </SectionStack>
  );
}

interface InfoSectionTitleProps
  extends Pick<TypographyProps, "component">,
    RequiresChildren {
  "data-testid"?: string;
}

export function InfoSectionTitle(props: InfoSectionTitleProps) {
  return (
    <Typography
      component={props.component ?? "h4"}
      level="title-md"
      data-testid={props["data-testid"]}
    >
      {props.children}
    </Typography>
  );
}
