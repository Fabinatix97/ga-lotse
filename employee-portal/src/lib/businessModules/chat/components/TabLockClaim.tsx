/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";

export function TabLockClaim({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Stack alignItems="center" gap={2} width="60%" textAlign="center">
        <Typography level="title-md">
          Der Chat ist bereits in einem anderen Fenster geöffnet. Klicken Sie
          auf &#34;Weiter&#34;, um den Chat hier zu öffnen und das andere
          Fenster zu schließen.
        </Typography>
        <Button onClick={onConfirm} sx={{ marginTop: 2 }}>
          Weiter
        </Button>
      </Stack>
    </Stack>
  );
}
