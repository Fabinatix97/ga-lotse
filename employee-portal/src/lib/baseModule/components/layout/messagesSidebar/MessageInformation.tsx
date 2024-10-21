/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert, Box, Typography } from "@mui/joy";

import { ClientState } from "@/lib/businessModules/chat/shared/enums";

interface MessageInformationProps {
  clientState: ClientState.CreateBackupKey | ClientState.RestoreBackupKey;
}

export function MessageInformation({ clientState }: MessageInformationProps) {
  const text =
    clientState === ClientState.CreateBackupKey
      ? "Richten Sie ein Sicherheitsbackup ein um die Chatfunktion zu nutzen"
      : "Bestätigen sie dieses Endgerät um die Chatfunktion zu nutzen";

  return (
    <Alert
      variant="outlined"
      color="primary"
      invertedColors
      sx={{ alignItems: "flex-start" }}
      startDecorator={<WarningAmberOutlined fontSize="xl2" />}
    >
      <Box>
        <Typography level="title-md" color="primary" data-testid="title">
          Chat
        </Typography>
        <Typography
          level="body-sm"
          color="primary"
          sx={{
            fontSize: {
              xs: "sm",
              sm: "md",
            },
          }}
          data-testid="message"
        >
          {text}
        </Typography>
      </Box>
    </Alert>
  );
}
