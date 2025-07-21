/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";

export function TabLockTakenByAnotherTab() {
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        height: "100%",
      }}
    >
      <Stack alignItems="center" gap={2} width="60%" textAlign="center">
        <Typography level="h3">
          Der Chat ist in einem anderen Tab aktiv.
        </Typography>
        <Typography level="title-md">
          Wechseln Sie zum entsprechenden Tab, um den Chat zu nutzen. Dieser Tab
          kann geschlossen werden.
        </Typography>
      </Stack>
    </Stack>
  );
}
