/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { decodeBase64 } from "matrix-js-sdk/lib/base64";
import { MatrixClient } from "matrix-js-sdk/lib/client";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

interface RustCryptoArgs {
  rustCryptoStoreKey?: Uint8Array;
  rustCryptoStorePassword?: string;
}

export function getRustCryptoStoreArgs(pickleKey: string | null) {
  const rustCryptoArgs: RustCryptoArgs = {};
  if (pickleKey) {
    // The pickleKey, if provided can be used for the crypto store.
    if (pickleKey.length === 43) {
      rustCryptoArgs.rustCryptoStoreKey = decodeBase64(pickleKey);
    } else {
      rustCryptoArgs.rustCryptoStorePassword = pickleKey;
    }
  }
  return rustCryptoArgs;
}

export async function fetchBackupInfo(matrixClient: MatrixClient) {
  const backupInfo = await matrixClient.getKeyBackupVersion();
  const has4S = await matrixClient.secretStorage.hasKey();
  const backupKeyStored = has4S
    ? !!(await matrixClient.isKeyBackupKeyStored())
    : false;

  logger.debug("fetchBackupInfo", { backupKeyStored, backupInfo, has4S });

  return { backupInfo, has4S, backupKeyStored };
}

export async function getBackupKeyStatus(matrixClient: MatrixClient) {
  const crypto = matrixClient.getCrypto();
  if (!crypto) return;

  const secretStorage = matrixClient.secretStorage;

  const isKeyBackupKeyStored = await matrixClient.isKeyBackupKeyStored();

  const backupKeyStored = !!isKeyBackupKeyStored;
  const backupKeyFromCache = await crypto.getSessionBackupPrivateKey();
  const backupKeyCached = !!backupKeyFromCache;
  const backupKeyWellFormed = backupKeyFromCache instanceof Uint8Array;
  const secretStorageKeyInAccount = await secretStorage.hasKey();
  const secretStorageReady = await crypto.isSecretStorageReady();

  return {
    backupKeyStored,
    backupKeyCached,
    backupKeyWellFormed,
    secretStorageKeyInAccount,
    secretStorageReady,
  };
}

export async function getCrossSigningStatus(matrixClient: MatrixClient) {
  const crypto = matrixClient.getCrypto();
  if (!crypto) return;

  const crossSigningStatus = await crypto.getCrossSigningStatus();
  const crossSigningPublicKeysOnDevice = crossSigningStatus.publicKeysOnDevice;
  const crossSigningPrivateKeysInStorage =
    crossSigningStatus.privateKeysInSecretStorage;
  const masterPrivateKeyCached =
    crossSigningStatus.privateKeysCachedLocally.masterKey;
  const selfSigningPrivateKeyCached =
    crossSigningStatus.privateKeysCachedLocally.selfSigningKey;
  const userSigningPrivateKeyCached =
    crossSigningStatus.privateKeysCachedLocally.userSigningKey;
  const homeserverSupportsCrossSigning =
    await matrixClient.doesServerSupportUnstableFeature(
      "org.matrix.e2e_cross_signing",
    );
  const crossSigningReady = await crypto.isCrossSigningReady();

  return {
    crossSigningPublicKeysOnDevice,
    crossSigningPrivateKeysInStorage,
    masterPrivateKeyCached,
    selfSigningPrivateKeyCached,
    userSigningPrivateKeyCached,
    homeserverSupportsCrossSigning,
    crossSigningReady,
  };
}

export async function isDeviceVerified(client: MatrixClient, deviceId: string) {
  const trustLevel = await client
    .getCrypto()
    ?.getDeviceVerificationStatus(client.getSafeUserId(), deviceId);
  if (!trustLevel) {
    // either no crypto, or an unknown/no-e2e device
    return null;
  }
  return trustLevel.crossSigningVerified;
}
