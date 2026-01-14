/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { IconButton, styled } from "@mui/joy";

export const HeaderIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": { backgroundColor: theme.palette.primary[300] },
  "&:active": { backgroundColor: theme.palette.primary[400] },
  "&:focus-visible": { backgroundColor: theme.palette.primary[400] },
}));
