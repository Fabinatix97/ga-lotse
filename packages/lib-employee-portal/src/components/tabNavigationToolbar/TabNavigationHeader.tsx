/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography, TypographyProps } from "@mui/joy";
import { Children, useEffect, useRef } from "react";

import { RequiresChildren, useIsMobile } from "@eshg/lib-portal";

interface TabNavigationHeaderProps extends RequiresChildren {
  titleAsH1?: boolean;
}

export function TabNavigationHeader(props: TabNavigationHeaderProps) {
  const isMobile = useIsMobile();

  const firstChild = Children.toArray(props.children)[0];

  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.titleAsH1) {
      // Focus the title when the page is loaded
      titleRef.current?.focus();
    }
  }, [props.titleAsH1]);

  return (
    <Stack
      ref={titleRef}
      component={props.titleAsH1 ? "h1" : "div"}
      tabIndex={props.titleAsH1 ? -1 : undefined}
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
      component="span"
      sx={{ lineHeight: "27px", ...sx }}
      {...props}
      noWrap
    >
      {children}
    </Typography>
  );
}
