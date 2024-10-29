/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, Stack, Typography, TypographyProps, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Children, ReactNode, createContext, useContext, useId } from "react";

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

const InfoSectionTitleIdContext = createContext<string | undefined>(undefined);

export function InfoSection(props: InfoSectionProps) {
  const titleId = useId();

  return (
    <InfoSectionTitleIdContext.Provider value={titleId}>
      <SectionStack
        component="section"
        direction="row"
        gap={2}
        sx={props.sx}
        aria-labelledby={titleId}
      >
        {props.icon}
        <Stack gap={0.5} sx={{ overflow: "hidden", flexGrow: 1 }}>
          {props.children}
        </Stack>
      </SectionStack>
    </InfoSectionTitleIdContext.Provider>
  );
}

interface InfoSectionTitleProps
  extends Pick<TypographyProps, "component">,
    RequiresChildren {
  "data-testid"?: string;
}

export function InfoSectionTitle(props: InfoSectionTitleProps) {
  const titleId = useContext(InfoSectionTitleIdContext);
  return (
    <Typography
      component={props.component ?? "h4"}
      level="title-md"
      data-testid={props["data-testid"]}
      id={titleId}
    >
      {props.children}
    </Typography>
  );
}
