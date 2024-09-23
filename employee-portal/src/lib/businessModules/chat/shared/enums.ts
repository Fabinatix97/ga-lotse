/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum ClientState {
  Idle = "Idle",
  Authorized = "AUTHORIZED",
  ClientCreated = "CLIENT_CREATED",
  ReadyForEncryption = "READY_FOR_ENCRYPTION",
  CreateBackupKey = "CREATE_BACKUP_KEY",
  RestoreBackupKey = "RESTORE_BACKUP_KEY",
  BackupSetupComplete = "BACKUP_SETUP_COMPLETE",
  Prepared = "PREPARED",
  Restart = "RESTART",
  Error = "ERROR",
}

export enum CommunicationType {
  DirectMessage = "DIRECT_MESSAGE",
  PublicRoom = "PUBLIC_ROOM",
}
