/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid } from "@mui/joy";

interface DetailsGridProps extends RequiresChildren {
  "data-testid"?: string;
}

export function DetailsGrid(props: Readonly<DetailsGridProps>) {
  return (
    <Grid
      container
      columnSpacing={2}
      rowSpacing={2}
      data-testid={props["data-testid"]}
    >
      {props.children}
    </Grid>
  );
}
