/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

export const SectionGrid = styled("section")(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(4),
  gridTemplateColumns: "1fr 1fr",

  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column",
  },
}));
