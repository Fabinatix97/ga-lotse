/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient } from "matrix-js-sdk/lib/client";
import { KeyBackupInfo } from "matrix-js-sdk/lib/crypto-api";
import {
  AuthDict,
  UIAResponse,
  UIAuthCallback,
} from "matrix-js-sdk/lib/matrix";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

import { getSecretStorageKey } from "./cryptoCallbacks";

export async function deleteBackup(
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

export async function authUploadDeviceSigningKeysByPassword(
  makeRequest: (authData: AuthDict | null) => Promise<UIAResponse<void>>,
  matrixClient: MatrixClient,
) {
  await makeRequest({
    type: "m.login.password",
    identifier: {
      type: "m.id.user",
      user: matrixClient.getSafeUserId(),
    },
    password: "password",
  });
}

export async function restoreKeyBackupWithCache(
  matrixClient: MatrixClient,
  backupInfo?: KeyBackupInfo | null,
) {
  let handled = false;

  if (backupInfo) {
    try {
      const gotCache = await matrixClient.restoreKeyBackupWithCache(
        undefined /* targetRoomId */,
        undefined /* targetSessionId */,
        backupInfo,
      );
      if (gotCache) {
        handled = true;
        logger.debug("RestoreKeyBackup: found cached backup key");
      }
    } catch (e) {
      logger.debug("restoreKeyBackupWithCache failed", e);
    }
  }

  return handled;
}

export async function restoreKeyBackupWithSecretStorage(
  matrixClient: MatrixClient,
  backupInfo?: KeyBackupInfo | null,
  backupKeyStored?: boolean,
  passphrase?: string,
) {
  let handled = false;

  if (backupKeyStored) {
    try {
      if (backupInfo) {
        await accessSecretStorage(matrixClient, passphrase);
        const keyBackup = await matrixClient.restoreKeyBackupWithSecretStorage(
          backupInfo,
          undefined,
          undefined,
        );
        handled = true;
        logger.debug("restoreKeyBackupWithSecretStorage", { keyBackup });
      }
    } catch (e) {
      logger.softError("restoreKeyBackupWithSecretStorage failed");
      throw e;
    }
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
        "End-to-end encryption is disabled - unable to access secret storage.",
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
        "End-to-end encryption is disabled - unable to access secret storage.",
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
