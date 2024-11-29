/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CircularProgress, Stack, Typography } from "@mui/joy";

import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function ProcessImportPending() {
  return (
    <SidebarContent title="Daten Importieren">
      <Stack
        direction="column"
        alignItems="center"
        gap={3}
        sx={{ marginTop: 6 }}
        data-testid="importPending"
      >
        <CircularProgress variant="plain" size="lg" />
        <Typography level="body-md" textAlign="center" width={0.75}>
          Der Import kann einige Zeit in Anspruch nehmen. Bitte schließen Sie
          dieses Fenster nicht.
        </Typography>
      </Stack>
    </SidebarContent>
  );
}
