/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid } from "@mui/joy";

export function QuarterWidthGrid(props: RequiresChildren) {
  return (
    <Grid container sx={{ flexGrow: 1 }}>
      <Grid xxs={12} lg={3}>
        {props.children}
      </Grid>
    </Grid>
  );
}
