/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, styled } from "@mui/joy";

export const SidecarFormLayout = styled("div")(({ theme }) => ({
  display: "grid",
  minHeight: "100%",
  gridTemplateColumns: "9fr 3fr",
  gap: theme.spacing(3),
  margin: theme.spacing(3),
  [theme.breakpoints.down("lg")]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },
  alignItems: "start",
}));

export const SidecarSheet = styled(Sheet)(() => ({
  position: "sticky",
  top: "12rem",
  width: "100%",
}));

export const SidecarContainer = styled(Stack)(({ theme }) => ({
  position: "sticky",
  top: "12rem",
  width: "100%",
  gap: theme.spacing(3),
}));
