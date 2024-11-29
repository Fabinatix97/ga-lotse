/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, CircularProgress, Stack, Typography } from "@mui/joy";

import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface ImportDataPendingSidebar {
  onAbort: () => void;
}

export function ImportDataPendingSidebar({
  onAbort,
}: ImportDataPendingSidebar) {
  return (
    <>
      <SidebarContent title="Daten importieren">
        <Stack alignItems="center" padding={8} gap={4}>
          <CircularProgress
            variant="plain"
            sx={{ "--CircularProgress-size": "100px" }}
          />
          <Typography textAlign="center">
            Der Import kann einige Zeit in Anspruch nehmen. Bitte schließen Sie
            dieses Fenster nicht.
          </Typography>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <ButtonBar
          right={
            <Button onClick={() => onAbort()} variant="soft" color="neutral">
              Import abbrechen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}
