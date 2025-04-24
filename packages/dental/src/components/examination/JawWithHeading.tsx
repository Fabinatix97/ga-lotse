/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, Stack } from "@mui/joy";
import { ReactNode } from "react";

interface JawFormWithHeadingProps {
  heading: ReactNode;
  left: ReactNode;
  right: ReactNode;
}

export function JawWithHeading(props: JawFormWithHeadingProps) {
  return (
    <Stack>
      {props.heading}
      <Grid container sx={{ flexWrap: "nowrap" }}>
        <Grid
          sx={{
            borderRight: "0.5px solid black",
            padding: "24px 24px 24px 4px",
          }}
        >
          {props.left}
        </Grid>
        <Grid
          sx={{
            borderLeft: "0.5px solid black",
            padding: "24px 4px 24px 24px",
          }}
        >
          {props.right}
        </Grid>
      </Grid>
    </Stack>
  );
}
