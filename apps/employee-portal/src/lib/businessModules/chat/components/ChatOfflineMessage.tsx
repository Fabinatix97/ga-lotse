/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert, Box, Typography } from "@mui/joy";

export function ChatOfflineMessage() {
  return (
    <Alert
      variant="outlined"
      color="danger"
      invertedColors
      sx={{ alignItems: "flex-start" }}
      startDecorator={<WarningAmberOutlined fontSize="xl2" />}
      role="note"
      data-testid="alert"
    >
      <Box>
        <Typography level="title-md" color="danger" data-testid="title">
          Chat ist offline
        </Typography>
        <Typography
          level="body-sm"
          color="danger"
          sx={{
            fontSize: {
              xs: "sm",
              sm: "md",
            },
          }}
          data-testid="message"
        >
          Der Chat ist momentan nicht verfügbar. Bitte versuchen Sie es später
          erneut.
        </Typography>
      </Box>
    </Alert>
  );
}
