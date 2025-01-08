/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { CircularProgress, Stack, Typography } from "@mui/joy";

import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function ImportDataPendingSidebar() {
  return (
    <>
      <SidebarContent title="Daten importieren">
        <Stack alignItems="center" padding={8} gap={4}>
          <CircularProgress
            variant="plain"
            sx={{ "--CircularProgress-size": "100px" }}
          />
          <Typography textAlign="center">
            Der Import kann bis zu 5 Minuten dauern. Schließen Sie dieses
            Fenster nicht.
          </Typography>
        </Stack>
      </SidebarContent>
    </>
  );
}
