/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Grid, GridProps, Sheet, Typography, styled } from "@mui/joy";
import { PropsWithChildren } from "react";

export const SectionColumn = styled((props: GridProps) => (
  <Grid xs={12} md={6} lg={4} {...props} />
))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
}));

export const SectionGridContainer = styled((props: GridProps) => (
  <Grid container spacing={3} {...props} />
))();

export function Section({
  title,
  titleId,
  children,
}: PropsWithChildren<{
  title: string;
  titleId?: string;
}>) {
  return (
    <Sheet sx={{ p: 3 }}>
      <Typography level="h3" id={titleId} sx={{ mb: 3 }}>
        {title}
      </Typography>
      {children}
    </Sheet>
  );
}
