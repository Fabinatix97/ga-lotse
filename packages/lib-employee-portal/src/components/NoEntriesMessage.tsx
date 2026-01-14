/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Stack, Typography } from "@mui/joy";

export function NoEntriesMessage() {
  return (
    <Stack alignItems="center">
      <Typography level="body-sm">Keine Einträge vorhanden</Typography>
    </Stack>
  );
}
