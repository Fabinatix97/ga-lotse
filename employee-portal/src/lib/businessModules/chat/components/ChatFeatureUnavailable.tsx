/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert, Box, Typography } from "@mui/joy";

export function ChatFeatureUnavailable() {
  return (
    <Alert
      variant="outlined"
      color="danger"
      invertedColors
      sx={{ alignItems: "flex-start" }}
      startDecorator={<WarningAmberOutlined fontSize="xl2" />}
    >
      <Box>
        <Typography color="danger">
          Der Chat-Dienst ist nicht verfügbar.
        </Typography>
      </Box>
    </Alert>
  );
}
