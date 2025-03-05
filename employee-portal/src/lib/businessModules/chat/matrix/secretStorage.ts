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

export async function restoreKeyBackupFromCache(matrixClient: MatrixClient) {
  let handled = false;
  try {
    const crypto = matrixClient.getCrypto();
    if (!crypto) throw new Error("CryptoApi is undefined");

    const keyBackup = await crypto.restoreKeyBackup();
    if (keyBackup) {
      handled = true;
      logger.debug("Key backup restored successfully from cache");
    }
  } catch (e) {
    logger.softError("Failed to restore key backup from cache", e);
  }
  return handled;
}

export async function restoreBackupKeyFromSecretStorage(
  matrixClient: MatrixClient,
  passphrase?: string,
) {
  try {
    await accessSecretStorage(matrixClient, passphrase);
    const crypto = matrixClient.getCrypto();
    if (!crypto) throw new Error("CryptoApi is undefined");

    await crypto.loadSessionBackupPrivateKeyFromSecretStorage();
    const keyBackup = await crypto.restoreKeyBackup();
    if (!keyBackup) throw new Error("KeyBackup is null");

    logger.debug("Key backup successfully loaded from secret storage");
    logger.debug(
      `Total keys: ${keyBackup.total}, Imported keys: ${keyBackup.imported}`,
    );
  } catch (e) {
    logger.softError("Failed to load key backup from secret storage");
    throw e;
  }
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
      setupNewSecretStorage: true,
    });

    await crypto.bootstrapCrossSigning({
      authUploadDeviceSigningKeys,
      setupNewCrossSigning: true,
    });

    await crypto.resetKeyBackup();
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

    await crypto.bootstrapCrossSigning({});
    await crypto.bootstrapSecretStorage({});
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
