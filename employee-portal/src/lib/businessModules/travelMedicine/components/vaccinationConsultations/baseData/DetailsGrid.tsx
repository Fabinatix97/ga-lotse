/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid } from "@mui/joy";
import { ReactNode } from "react";

export function DetailsGrid({ children }: Readonly<{ children: ReactNode }>) {
  const SPACING = { xxs: 2, sm: 3, md: 3, xxl: 3 };
  return (
    <Grid container columnSpacing={2} rowSpacing={SPACING}>
      {children}
    </Grid>
  );
}
