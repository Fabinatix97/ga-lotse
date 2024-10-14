/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid } from "@mui/joy";

import { byBreakpoint } from "@/lib/shared/breakpoints";

export function QuarterWidthGrid(props: RequiresChildren) {
  return (
    <Grid container sx={{ flexGrow: 1 }}>
      <Grid {...byBreakpoint({ mobile: 12, desktop: 6 })}>
        {props.children}
      </Grid>
    </Grid>
  );
}
