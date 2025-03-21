/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, Stack, StackProps, Typography, styled } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { Children, ReactNode, createContext, useContext, useId } from "react";

import { byBreakpoint } from "@/lib/shared/breakpoints";

interface InfoSectionGridProps extends RequiresChildren {
  "data-testid"?: string;
}

export function InfoSectionGrid(props: InfoSectionGridProps) {
  return (
    <Grid
      container
      spacing={2}
      columns={byBreakpoint({ mobile: 1, desktop: 2 })}
      data-testid={props["data-testid"]}
    >
      {Children.map(
        props.children,
        (infoSection) => infoSection && <Grid xxs={1}>{infoSection}</Grid>,
      )}
    </Grid>
  );
}

export const SectionStack = styled(Stack)({
  ".MuiSvgIcon-root": {
    height: "24px",
    width: "24px",
    marginTop: "0rem",
  },
}) as typeof Stack;

interface InfoSectionProps extends RequiresChildren {
  icon?: ReactNode;
  sx?: SxProps;
  "data-testid"?: string;
  slotProps?: {
    section?: StackProps;
    stack?: StackProps;
  };
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
        data-testid={props["data-testid"]}
      >
        {props.icon}
        <Stack
          gap={0.5}
          {...props.slotProps?.stack}
          sx={{
            overflow: "hidden",
            flexGrow: 1,
            ...props.slotProps?.stack?.sx,
          }}
        >
          {props.children}
        </Stack>
      </SectionStack>
    </InfoSectionTitleIdContext.Provider>
  );
}

interface InfoSectionTitleProps extends RequiresChildren {
  "data-testid"?: string;
  level?: 2 | 3;
  sx?: SxProps;
}

export function InfoSectionTitle(props: InfoSectionTitleProps) {
  const titleId = useContext(InfoSectionTitleIdContext);
  return (
    <Typography
      component={props.level === 2 ? "h2" : "h3"}
      level="title-md"
      data-testid={props["data-testid"]}
      id={titleId}
      sx={props.sx}
    >
      {props.children}
    </Typography>
  );
}

export function InfoSectionField({
  icon,
  label,
  children,
}: {
  icon?: ReactNode;
  label: string;
  children: ReactNode | string | undefined;
}) {
  return (
    <Grid xxs={1}>
      <InfoSection icon={icon}>
        <InfoSectionTitle>{label}</InfoSectionTitle>
        {children ?? "-"}
      </InfoSection>
    </Grid>
  );
}
