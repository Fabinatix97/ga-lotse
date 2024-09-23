/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

export function NoEntries() {
  return (
    <Stack alignItems="center">
      <Typography level="body-sm">Keine Einträge vorhanden</Typography>
    </Stack>
  );
}
