/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

export const SectionGrid = styled("section")(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(5),
  columnGap: theme.spacing(3),
  gridTemplateColumns: "6fr 3fr",
  "& > *": {
    gridColumn: 1,
  },

  [theme.breakpoints.down("lg")]: {
    gridTemplateColumns: "1fr",
  },
}));
