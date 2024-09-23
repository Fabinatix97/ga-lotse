/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CancelOutlined, KeyOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { CreateBackupSidebar } from "@/lib/businessModules/chat/components/secureBackup/CreateBackupSidebar";
import { RestoreBackupSidebar } from "@/lib/businessModules/chat/components/secureBackup/RestoreBackupSidebar";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";

export interface SecureBackupContent {
  header: string;
  subheader: string;
  description: string[];
}

const content = {
  [ClientState.CreateBackupKey]: {
    header: "Set up Secure Backup",
    subheader: "Set up a secure backup to be able to use chat.",
    description: [
      "Safeguard against losing access to encrypted messages & data by backing up encryption keys on your server.",
      "Enter a Security Phrase only you know, as it's used to safeguard your data. To be secure, you shouldn't re-use your account password.",
    ],
  },
  [ClientState.RestoreBackupKey]: {
    header: "Verify this device",
    subheader: "Verify this device to be able to use chat.",
    description: [
      "Verify your identity to access encrypted messages and prove your identity to others.",
    ],
  },
};

export function BackupSetupView() {
  const [open, setOpen] = useState(false);
  const { clientState } = useChatClientContext();

  const stateContent: SecureBackupContent =
    content[clientState as keyof typeof content];

  return (
    <>
      <Sheet
        data-testid={"secureBackupSheet"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <Stack alignItems={"center"} gap={2}>
          <CancelOutlined fontSize={"xl4"} />
          <Typography>{stateContent.subheader}</Typography>
          <Button
            onClick={() => setOpen(true)}
            startDecorator={<KeyOutlined />}
          >
            {stateContent.header}
          </Button>
        </Stack>
      </Sheet>

      <OverlayBoundary>
        {clientState === ClientState.RestoreBackupKey ? (
          <RestoreBackupSidebar
            open={open}
            onClose={() => setOpen(false)}
            content={stateContent}
          />
        ) : (
          <CreateBackupSidebar
            open={open}
            onClose={() => setOpen(false)}
            content={stateContent}
          />
        )}
      </OverlayBoundary>
    </>
  );
}
