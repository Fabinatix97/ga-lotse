/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Grid, GridProps } from "@mui/joy";

interface FormGroupGridProps
  extends Pick<GridProps, "columns" | "aria-labelledby" | "component">,
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
