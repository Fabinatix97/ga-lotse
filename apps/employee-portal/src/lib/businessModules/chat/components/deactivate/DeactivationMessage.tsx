/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert, Box, Typography } from "@mui/joy";

export function DeactivationMessage() {
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
          Chat ist deaktiviert
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
          Sie haben Ihren Chataccount deaktiviert. Eine weitere Nutzung dieser
          Funktion ist nicht möglich.
        </Typography>
      </Box>
    </Alert>
  );
}
