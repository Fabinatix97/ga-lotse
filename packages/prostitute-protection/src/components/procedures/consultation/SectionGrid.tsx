/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

export const SectionGrid = styled("section", {
  shouldForwardProp(propName) {
    return !["columns", "defaultColumn", "breakpoint"].includes(
      propName as string,
    );
  },
})<{
  columns?: string;
  defaultColumn?: number;
  breakpoint?: "xxl" | "xl" | "lg" | "md";
}>(({ theme, defaultColumn, columns, breakpoint }) => ({
  display: "grid",
  rowGap: theme.spacing(5),
  columnGap: theme.spacing(3),
  gridTemplateColumns: columns ?? "6fr 3fr",

  "& > *": {
    gridColumn: defaultColumn,
  },

  [theme.breakpoints.down(breakpoint ?? "lg")]: {
    display: "flex",
    flexDirection: "column",
  },
}));
