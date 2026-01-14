/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography, TypographyProps } from "@mui/joy";

export interface SideIndicatorProps {
  sideIndicator: "L" | "R";
  sideIndicatorPosition: TypographyProps["textAlign"];
  id?: string;
}

export function SideIndicator(props: SideIndicatorProps) {
  return (
    <Typography
      level="h1"
      component="h2"
      alignSelf="center"
      flexGrow={1}
      textAlign={props.sideIndicatorPosition}
      id={props.id}
    >
      {props.sideIndicator}
    </Typography>
  );
}
