/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CancelOutlined, KeyOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";

import { OverlayBoundary } from "@eshg/lib-employee-portal";

import { CreateBackupSidebar } from "@/lib/businessModules/chat/components/secureBackup/CreateBackupSidebar";
import { RestoreBackupSidebar } from "@/lib/businessModules/chat/components/secureBackup/RestoreBackupSidebar";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";

export interface SecureBackupContent {
  header: string;
  headerSidebar: string;
  subheader: string;
  description: string[];
}

const content = {
  [ClientState.CreateKeyBackup]: {
    header: "Richten Sie ein Sicherheitsbackup ein",
    headerSidebar: "Sicherheitsbackup",
    subheader:
      "Richten Sie ein Sicherheitsbackup ein um die Chatfunktion zu nutzen",
    description: [
      "Sichern Sie Ihre verschlüsselten Nachrichten und Daten, indem Sie die Sicherheitsschlüssel auf Ihrem Server speichern. Wählen Sie ein eigenes, sicheres Passwort, das Sie nirgendwo anders verwenden.",
    ],
  },
  [ClientState.RestoreKeyBackup]: {
    header: "Bestätigen sie dieses Endgerät",
    headerSidebar: "Bestätigen sie dieses Endgerät",
    subheader: "Bestätigen sie dieses Endgerät um die Chatfunktion zu nutzen",
    description: [
      "Bestätigen Sie Ihre Identität, um auf verschlüsselte Nachrichten zuzugreifen und Ihre Identität gegenüber anderen zu bestätigen.",
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
        data-testid="create-key-backup"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          height: "100%",
        }}
      >
        <Stack alignItems="center" gap={2}>
          <CancelOutlined fontSize="xl4" />
          <Typography>{stateContent.subheader}</Typography>
          <Button
            startDecorator={<KeyOutlined />}
            onClick={() => setOpen(true)}
          >
            {stateContent.header}
          </Button>
        </Stack>
      </Sheet>

      <OverlayBoundary>
        {clientState === ClientState.CreateKeyBackup && (
          <CreateBackupSidebar
            open={open}
            content={stateContent}
            onClose={() => setOpen(false)}
          />
        )}

        {clientState === ClientState.RestoreKeyBackup && (
          <RestoreBackupSidebar
            open={open}
            content={stateContent}
            onClose={() => setOpen(false)}
          />
        )}
      </OverlayBoundary>
    </>
  );
}
