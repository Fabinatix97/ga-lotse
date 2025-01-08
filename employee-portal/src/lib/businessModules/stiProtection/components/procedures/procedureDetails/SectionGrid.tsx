/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

export const SectionGrid = styled("section")<{
  columns?: string;
  defaultColumn?: number;
}>(({ theme, defaultColumn, columns }) => ({
  display: "grid",
  rowGap: theme.spacing(5),
  columnGap: theme.spacing(3),
  gridTemplateColumns: columns ?? "6fr 3fr",

  "& > *": {
    gridColumn: defaultColumn,
  },

  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column",
  },
}));
