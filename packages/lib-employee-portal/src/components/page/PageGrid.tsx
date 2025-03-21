/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Grid } from "@mui/joy";
import { ReactNode } from "react";

/**
 * A Joy UI Grid with row and column spacing according to the
 * <a href="[internal design specs link]">design specs</a>
 * to be used for page layouts.
 */
export function PageGrid({ children }: { children: ReactNode }) {
  return (
    <Grid
      container
      spacing={{ xxs: 2, xs: 2, sm: 3, md: 4, lg: 4, xl: 4, xxl: 5 }}
    >
      {children}
    </Grid>
  );
}
