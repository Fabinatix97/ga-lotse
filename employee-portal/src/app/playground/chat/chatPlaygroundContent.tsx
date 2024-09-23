/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Box,
  Button,
  List,
  ListItem,
  ListItemDecorator,
  Sheet,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { isEmpty, isString, omit, pick } from "remeda";

import {
  fetchBackupInfo,
  isDeviceVerified,
} from "@/lib/businessModules/chat/matrix/crypto";
import {
  accessSecretStorage,
  deleteBackup,
} from "@/lib/businessModules/chat/matrix/secretStorage";
import { updateLocalStorageDeviceId } from "@/lib/businessModules/chat/matrix/tokens";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useBackupInfo } from "@/lib/businessModules/chat/shared/hooks/useBackupInfo";
import { useCrossSigningInfo } from "@/lib/businessModules/chat/shared/hooks/useCrossSigningInfo";

export function ChatPlaygroundContent() {
  const { matrixClient } = useChatClientContext();

  const { backupStatus, loadBackupStatus } = useBackupInfo();
  const { crossSigningStatus, loadCrossSigningStatus } = useCrossSigningInfo();

  const filteredBackupStatus = omit(backupStatus ?? {}, [
    "backupInfo",
    "backupTrustInfo",
  ]);

  const backupInfoStatus = pick(backupStatus ?? {}, [
    "backupInfo",
    "backupTrustInfo",
  ]);

  async function refreshStatus() {
    await loadBackupStatus();
    await loadCrossSigningStatus();
  }

  function clearStores() {
    matrixClient.stopClient();
    updateLocalStorageDeviceId("");
    window.location.href = window.location.href;
  }

  async function resetBackup() {
    try {
      const passphrase = window.prompt(
        "Create new Backup - Provide a passphrase for encryption",
      );

      if (!isString(passphrase) || isEmpty(passphrase)) {
        throw new Error(
          "Invalid passphrase - unable to access secret storage.",
        );
      }

      await accessSecretStorage(matrixClient, passphrase, true);
    } catch (error) {
      logger.softError("ResetBackup: failed", error);
      throw error;
    }
  }

  async function deleteKBackup() {
    await deleteBackup(matrixClient, backupInfoStatus.backupInfo);
  }

  async function handleDeviceVerify() {
    const deviceId = matrixClient.getDeviceId();
    if (!deviceId) return;
    const isVerified = await isDeviceVerified(matrixClient, deviceId);
    logger.debug({ isVerified });
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={2} direction="row">
        <Button color="danger" onClick={clearStores}>
          Reset Client
        </Button>
        <Button color="success" onClick={refreshStatus}>
          Refresh Status
        </Button>
        <Button color="success" onClick={() => fetchBackupInfo(matrixClient)}>
          Fetch BackUp Info
        </Button>
      </Stack>
      <Stack spacing={2} direction="row">
        <Button onClick={resetBackup}>Reset backup</Button>
        <Button onClick={deleteKBackup}>Delete backup</Button>
        <Button onClick={handleDeviceVerify}>Is Device verified</Button>
      </Stack>
      <Stack spacing={2} direction={{ xxs: "column", sm: "row" }}>
        <StatusList title="Backup Key Info" stateInfo={filteredBackupStatus} />
        <StatusList title="CrossSigning Info" stateInfo={crossSigningStatus} />
      </Stack>
      <Stack spacing={2}>
        {Object.entries(backupInfoStatus).map((item) => (
          <StateItem key={item[0]} item={item} />
        ))}
      </Stack>
    </Stack>
  );
}

function StatusList({
  stateInfo,
  title,
}: {
  stateInfo?: Record<string, unknown>;
  title: string;
}) {
  const theme = useTheme();

  return (
    <Sheet
      variant="outlined"
      sx={{
        padding: 3,
        borderRadius: "lg",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        flex: 1,
      }}
    >
      <Stack spacing={2}>
        <Typography level="h3">{title}</Typography>
        <List size="sm">
          {stateInfo &&
            Object.entries(stateInfo).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      backgroundColor: Boolean(value)
                        ? theme.palette.success.solidBg
                        : theme.palette.danger.solidBg,
                      borderRadius: "100%",
                    }}
                  />
                </ListItemDecorator>
                <Stack spacing={1} direction="row">
                  <Typography>{key}:</Typography>
                  <Typography color="neutral">
                    {JSON.stringify(value, null, 2)}
                  </Typography>
                </Stack>
              </ListItem>
            ))}
        </List>
      </Stack>
    </Sheet>
  );
}

function StateItem({ item }: { item: [string, unknown] }) {
  return (
    <Stack spacing={1}>
      <Typography>{item[0]}</Typography>
      <Sheet sx={{ padding: 1 }}>
        <Typography level="body-xs" fontFamily="monospace" fontSize="10px">
          {JSON.stringify(item[1], null, 2)}
        </Typography>
      </Sheet>
    </Stack>
  );
}
