/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useIsMobile } from "@eshg/lib-portal/hooks/useIsMobile";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Stack, Typography, TypographyProps } from "@mui/joy";
import { Children } from "react";

export interface TabNavigationHeaderProps extends RequiresChildren {
  titleAsH1?: boolean;
}

export function TabNavigationHeader(props: TabNavigationHeaderProps) {
  const isMobile = useIsMobile();

  const firstChild = Children.toArray(props.children)[0];

  return (
    <Stack
      component={props.titleAsH1 ? "h1" : "div"}
      sx={{ margin: "0" }}
      direction="row"
      gap={4}
      data-testid="tabNavigationHeader"
    >
      {isMobile ? firstChild : props.children}
    </Stack>
  );
}

export function TabNavigationHeaderTypography({
  children,
  sx,
  ...props
}: Omit<TypographyProps, "level">) {
  return (
    <Typography
      level="title-md"
      component="p"
      sx={{ lineHeight: "27px", ...sx }}
      {...props}
      noWrap
    >
      {children}
    </Typography>
  );
}
