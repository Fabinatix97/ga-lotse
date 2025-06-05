/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { styled } from "@mui/joy";

export const SectionGrid = styled("section")(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(4),
  gridTemplateColumns: "5fr 4fr",

  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column",
  },
}));

export const SubRow = styled("div")(({ theme }) => ({
  display: "grid",
  rowGap: theme.spacing(3),
  columnGap: theme.spacing(3),
  gridTemplateColumns: "2fr 3fr",
  alignItems: "center",

  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "unset",
  },
}));
