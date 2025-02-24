/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, UIAuthCallback } from "matrix-js-sdk";
import { KeyBackupInfo } from "matrix-js-sdk/lib/crypto-api";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

import { getSecretStorageKey } from "./cryptoCallbacks";

export async function deleteKeyBackup(
  matrixClient: MatrixClient,
  backupInfo?: KeyBackupInfo | null,
) {
  try {
    const crypto = matrixClient.getCrypto();
    if (!crypto) {
      throw new Error("DeleteBackup: End-to-end encryption is disabled");
    }

    if (!backupInfo?.version) {
      throw new Error("DeleteBackup: BackupInfo version is not available");
    }

    await crypto.deleteKeyBackupVersion(backupInfo.version);
    logger.debug("DeleteBackup: succeed");
  } catch (error) {
    logger.softError("DeleteBackup: failed", error);
  }
}

export async function restoreKeyBackup(matrixClient: MatrixClient) {
  let handled = false;
  try {
    const crypto = matrixClient.getCrypto();
    if (!crypto) throw new Error("CryptoApi is undefined");

    const keyBackup = await crypto.restoreKeyBackup();
    if (keyBackup) {
      handled = true;
      logger.debug("Key backup restored successfully");
    }
  } catch (e) {
    logger.softError("Failed to restore key backup", e);
  }
  return handled;
}

export async function loadBackupKeyFromSecretStorage(
  matrixClient: MatrixClient,
  passphrase?: string,
) {
  let handled = false;

  try {
    await accessSecretStorage(matrixClient, passphrase);
    const crypto = matrixClient.getCrypto();
    if (!crypto) throw new Error("CryptoApi is undefined");

    await crypto.loadSessionBackupPrivateKeyFromSecretStorage();
    const keyBackup = await crypto.restoreKeyBackup();
    if (keyBackup) {
      handled = true;
      logger.debug("Key backup successfully loaded from secret storage");
    }
  } catch (e) {
    logger.softError("Failed to load key backup from secret storage");
    throw e;
  }

  return handled;
}

export async function setupNewSecretStorage(
  matrixClient: MatrixClient,
  passphrase: string,
  authUploadDeviceSigningKeys: UIAuthCallback<void>,
): Promise<void> {
  try {
    const crypto = matrixClient.getCrypto();
    if (!crypto) {
      throw new Error(
        "SetupNewSecretStorage: End-to-end encryption is disabled - unable to create secret storage.",
      );
    }

    const recoveryKey = crypto.createRecoveryKeyFromPassphrase(passphrase);

    await crypto.bootstrapSecretStorage({
      createSecretStorageKey: () => recoveryKey,
      setupNewKeyBackup: true,
      setupNewSecretStorage: true,
    });

    await crypto.bootstrapCrossSigning({
      authUploadDeviceSigningKeys,
      setupNewCrossSigning: true,
    });
  } catch (e) {
    logger.softError("SetupNewSecretStorage: error during operation", e);
    throw e;
  }
}

export async function accessSecretStorage(
  matrixClient: MatrixClient,
  passphrase?: string,
  disableCache = false,
): Promise<void> {
  try {
    const crypto = matrixClient.getCrypto();
    if (!crypto) {
      throw new Error(
        "AccessSecretStorage: End-to-end encryption is disabled - unable to access secret storage.",
      );
    }

    matrixClient.cryptoCallbacks.getSecretStorageKey = (keys) =>
      getSecretStorageKey(keys, matrixClient, passphrase, disableCache);

    await crypto.bootstrapSecretStorage({
      setupNewKeyBackup: false,
      setupNewSecretStorage: false,
    });

    await crypto.bootstrapCrossSigning({
      setupNewCrossSigning: false,
    });
  } catch (e) {
    logger.softError("AccessSecretStorage: error during operation", e);
    throw e;
  }
}

export async function validateAccessSecretStorage(
  matrixClient: MatrixClient,
  passphrase: string,
) {
  await accessSecretStorage(matrixClient, passphrase, true);
}
