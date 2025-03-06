/**
 * Copyright 2025 cronn GmbH
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
    header: "Richten Sie ein Sicherheitsbackup ein",
    subheader:
      "Richten Sie ein Sicherheitsbackup ein um die Chatfunktion zu nutzen",
    description: [
      "Schützen Sie sich vor dem Verlust des Zugriffs auf verschlüsselte Nachrichten und Daten, indem Sie die Sicherheitsschlüssel auf Ihrem Server sichern.",
      "Geben Sie ein Passwort ein, das nur Sie kennen, da es zum Schutz Ihrer Daten verwendet wird. Aus Sicherheitsgründen sollten Sie Ihr GA-Lotse Benutzerpasswort nicht wieder verwenden.",
    ],
  },
  [ClientState.RestoreBackupKey]: {
    header: "Bestätigen sie dieses Endgerät",
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
        data-testid={"create-key-backup"}
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
