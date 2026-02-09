/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography, useTheme } from "@mui/joy";

export function GroupView({ row }: { row?: string }) {
  const theme = useTheme();
  return (
    <Stack component="dl">
      <Typography component="dt" textColor={theme.palette.text.secondary}>
        Gruppe
      </Typography>
      <Typography component="dd" fontWeight={600}>
        {row}
      </Typography>
    </Stack>
  );
}
