/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, styled } from "@mui/joy";

export const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
  flex: 0,
  gap: theme.spacing(1),
  "--ListItem-radius": theme.radius.md,
  position: "static",
}));
