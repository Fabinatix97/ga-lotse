/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, UIAuthCallback } from "matrix-js-sdk";
import {
  CryptoApi,
  GeneratedSecretStorageKey,
  ImportRoomKeyProgressData,
  ImportRoomKeyStage,
} from "matrix-js-sdk/lib/crypto-api";

import {
  fetchBackupInfo,
  getCryptoApi,
} from "@/lib/businessModules/chat/matrix/crypto";
import { getSecretStorageKeyFromCache } from "@/lib/businessModules/chat/matrix/cryptoCallbacks";
import { startDehydration } from "@/lib/businessModules/chat/shared/dehydrated";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import {
  fetchBackupInfoWithRetry,
  retryAsyncOperation,
} from "@/lib/businessModules/chat/shared/utils";

export async function deleteKeyBackupFromSecretStorage(
  matrixClient: MatrixClient,
) {
  try {
    const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
    const backupInfo = await cryptoApi.getKeyBackupInfo();
    if (!backupInfo?.version) {
      throw new Error("DeleteBackup: BackupInfo version is not available");
    }

    logger.debug("deleteKeyBackup version:", backupInfo.version);
    await cryptoApi.deleteKeyBackupVersion(backupInfo.version);
  } catch (error) {
    logger.softError("Error deleteKeyBackup: failed", error);
  }
}

export async function hasKeyBackupInSecretStorage(matrixClient: MatrixClient) {
  const backupInfo = await fetchBackupInfoWithRetry(matrixClient);
  if (!backupInfo?.keyBackupInfo) {
    return false;
  }
  return backupInfo.hasDefaultKey;
}

export async function restoreKeyBackupFromSecretStorage(
  matrixClient: MatrixClient,
) {
  try {
    const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
    const keyBackup = await cryptoApi.restoreKeyBackup({
      progressCallback: (progress: ImportRoomKeyProgressData) => {
        if (progress.stage === ImportRoomKeyStage.Fetch) {
          logger.debug("Fetching room keys from KeyBackup...");
        } else if (progress.stage === ImportRoomKeyStage.LoadKeys) {
          logger.debug(
            `Loading room keys from KeyBackup: ${progress.successes}/${progress.total} succeeded, ${progress.failures} failed.`,
          );
        } else {
          logger.debug("restoreKeyBackup in progress...");
        }
      },
    });

    if (keyBackup) {
      if (keyBackup.imported === 0 && keyBackup.total > 0) {
        throw new Error(`Imported: 0 keys of total: ${keyBackup.total}`);
      }
      logger.debug(
        "restoreKeyBackup imported number of keys:",
        keyBackup.imported,
        "of total:",
        keyBackup.total,
      );
      return keyBackup;
    }
  } catch (e) {
    logger.softError("Failed to restore key backup", e);
  }
  return undefined; //TODO: probably not need to return undefined
}

export async function loadKeyBackupPrivateKeyFromSecretStorage(
  matrixClient: MatrixClient,
  passphrase?: string,
  recoveryKey?: string,
) {
  try {
    await accessSecretStorage(matrixClient, passphrase, recoveryKey);
    const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
    await cryptoApi.loadSessionBackupPrivateKeyFromSecretStorage();
    await restoreKeyBackupFromSecretStorage(matrixClient);

    await retryAsyncOperation(
      async () => await fetchBackupInfo(matrixClient),
      (keyBackupInfo) => keyBackupInfo.isBackupMatchesStoredKey === true,
      30,
      1000,
      true,
      "Failed to trust backupInfo isBackupMatchesStoredKey=false",
    );

    await startDehydration(matrixClient);
    logger.debug(
      "KeyBackup Private Key successfully loaded from server's SecretStorage to local CryptoStore",
    );
  } catch (e) {
    logger.softError("Failed to load key backup from secret storage");
    throw e;
  }
}

export async function bootstrapNewSecretStorage(
  matrixClient: MatrixClient,
  secretStorageRecoveryKey: Promise<GeneratedSecretStorageKey>,
  authUploadDeviceSigningKeys: UIAuthCallback<void>,
): Promise<void> {
  try {
    const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
    logger.info(
      "bootstrapSecretStorage, setupNewKeyBackup: true, setupNewSecretStorage: true",
    );
    await cryptoApi.bootstrapSecretStorage({
      createSecretStorageKey: () => secretStorageRecoveryKey,
      setupNewKeyBackup: true,
      setupNewSecretStorage: true,
    });

    logger.info("bootstrapCrossSigning, setupNewCrossSigning: true");
    await cryptoApi.bootstrapCrossSigning({
      authUploadDeviceSigningKeys,
      setupNewCrossSigning: true,
    });

    await retryAsyncOperation(
      async () => await cryptoApi.isCrossSigningReady(),
      (isCrossSigningReady) => isCrossSigningReady,
      30,
      1000,
      true,
      "Failed to boostrap CrossSigning",
    );

    await retryAsyncOperation(
      async () =>
        await matrixClient
          .getCrypto()!
          .getUserVerificationStatus(matrixClient.getUserId()!),
      (verificationStatus) => verificationStatus.isCrossSigningVerified(),
      30,
      1000,
      true,
      "Failed to verify CrossSigning",
    );

    await retryAsyncOperation(
      async () => await cryptoApi.isSecretStorageReady(),
      (isSecretStorageReady) => isSecretStorageReady,
      30,
      1000,
      true,
      "Failed to bootstrap SecretStorage",
    );

    const hasBackupInSecretStorage: boolean =
      await hasKeyBackupInSecretStorage(matrixClient);

    if (!hasBackupInSecretStorage) {
      throw new Error(
        "Failed bootstrapNewSecretStorage: no keyBackup found in SecretStorage",
      );
    }

    await startDehydration(matrixClient, true);
  } catch (e) {
    logger.softError("bootstrapNewSecretStorage: error during operation", e);
    throw e;
  }
}

export async function accessSecretStorage(
  matrixClient: MatrixClient,
  passphrase?: string,
  recoveryKey?: string,
  disableCache = false,
): Promise<void> {
  try {
    const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

    matrixClient.cryptoCallbacks.getSecretStorageKey = (keys) =>
      getSecretStorageKeyFromCache(
        keys,
        matrixClient,
        passphrase,
        recoveryKey,
        disableCache,
      );

    logger.info(
      "bootstrapSecretStorage, setupNewKeyBackup: false, setupNewSecretStorage: false",
    );
    await cryptoApi.bootstrapSecretStorage({
      setupNewKeyBackup: false,
      setupNewSecretStorage: false,
    });

    logger.info("bootstrapCrossSigning, setupNewCrossSigning: false");
    await cryptoApi.bootstrapCrossSigning({
      setupNewCrossSigning: false,
    });

    await retryAsyncOperation(
      async () => await cryptoApi.isSecretStorageReady(),
      (isSecretStorageReady) => isSecretStorageReady,
      30,
      1000,
      true,
      "Failed to bootstrap SecretStorage",
    );

    await retryAsyncOperation(
      async () => await cryptoApi.isCrossSigningReady(),
      (isCrossSigningReady) => isCrossSigningReady,
      30,
      1000,
      true,
      "Failed to boostrap CrossSigning",
    );

    await retryAsyncOperation(
      async () =>
        await matrixClient
          .getCrypto()!
          .getUserVerificationStatus(matrixClient.getUserId()!),
      (verificationStatus) => verificationStatus.isCrossSigningVerified(),
      30,
      1000,
      true,
      "Failed to verify CrossSigning",
    );

    await retryAsyncOperation(
      async () => await fetchBackupInfo(matrixClient),
      (keyBackupInfo) => keyBackupInfo.isBackupSignedByTrustedDevice === true,
      30,
      1000,
      true,
      "Failed to trust backupInfo isBackupSignedByTrustedDevice=false",
    );
  } catch (e) {
    logger.softError("AccessSecretStorage: error during operation", e);
    throw e;
  }
}

export async function validatePassphrase(
  matrixClient: MatrixClient,
  passphrase: string,
) {
  await accessSecretStorage(matrixClient, passphrase, undefined, true);
}

export async function validateRecoveryKey(
  matrixClient: MatrixClient,
  recoveryKey: string,
) {
  await accessSecretStorage(matrixClient, undefined, recoveryKey, true);
}
