/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { CancelOutlined } from "@mui/icons-material";
import { Sheet, Stack, Typography } from "@mui/joy";

export function NoProceduresFallback({ message }: { message: string }) {
  return (
    <Sheet
      sx={{
        mt: 2,
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
      }}
    >
      <Stack margin="auto 0" alignItems="center" gap={3}>
        <CancelOutlined fontSize="xl4" />
        <Typography>{message}</Typography>
      </Stack>
    </Sheet>
  );
}
