/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid, GridProps } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal";

interface FormGroupGridProps
  extends
    Pick<GridProps, "columns" | "aria-labelledby" | "component">,
    RequiresChildren {
  "data-testid"?: string;
}

export function FormGroupGrid({ children, ...props }: FormGroupGridProps) {
  return (
    <Grid container columnSpacing={4} rowSpacing={2} {...props}>
      {children}
    </Grid>
  );
}
