/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient } from "matrix-js-sdk";
import {
  BackupTrustInfo,
  CryptoApi,
  KeyBackupInfo,
} from "matrix-js-sdk/lib/crypto-api";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

export async function fetchBackupInfo(matrixClient: MatrixClient) {
  const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

  const keyBackupInfo: KeyBackupInfo | null =
    await cryptoApi.getKeyBackupInfo();

  const hasDefaultKey = await matrixClient.secretStorage.hasKey(undefined);

  const hasKeyBackupKeyStored = hasDefaultKey
    ? !!(await matrixClient.isKeyBackupKeyStored())
    : false;

  const backupTrustInfo: BackupTrustInfo | null = keyBackupInfo
    ? await cryptoApi.isKeyBackupTrusted(keyBackupInfo)
    : null;

  const isBackupSignedByTrustedDevice = backupTrustInfo?.trusted;
  const isBackupMatchesStoredKey = backupTrustInfo?.matchesDecryptionKey;

  logger.debug("fetchBackupInfo", {
    keyBackupInfo,
    hasDefaultKey,
    hasKeyBackupKeyStored,
    isBackupSignedByTrustedDevice,
    isBackupMatchesStoredKey,
  });

  return {
    keyBackupInfo,
    hasDefaultKey,
    hasKeyBackupKeyStored,
    isBackupSignedByTrustedDevice,
    isBackupMatchesStoredKey,
  };
}

export async function getBackupKeyStatus(matrixClient: MatrixClient) {
  const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

  const serverSideSecretStorage = matrixClient.secretStorage;

  const isKeyBackupKeyStored = await matrixClient.isKeyBackupKeyStored();

  const backupKeyStored = !!isKeyBackupKeyStored;
  const backupKeyFromCache = await cryptoApi.getSessionBackupPrivateKey();
  const backupKeyCached = !!backupKeyFromCache;
  const backupKeyWellFormed = backupKeyFromCache instanceof Uint8Array;
  const secretStorageKeyInAccount = await serverSideSecretStorage.hasKey();
  const secretStorageReady = await cryptoApi.isSecretStorageReady();

  logger.debug("getBackupKeyStatus", {
    backupKeyStored,
    backupKeyCached,
    backupKeyWellFormed,
    secretStorageKeyInAccount,
    secretStorageReady,
  });

  return {
    backupKeyStored,
    backupKeyCached,
    backupKeyWellFormed,
    secretStorageKeyInAccount,
    secretStorageReady,
  };
}

export async function getCrossSigningStatus(matrixClient: MatrixClient) {
  const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

  const crossSigningStatus = await cryptoApi.getCrossSigningStatus();
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
  const crossSigningReady = await cryptoApi.isCrossSigningReady();

  logger.debug("getCrossSigningStatus", {
    crossSigningPublicKeysOnDevice,
    crossSigningPrivateKeysInStorage,
    masterPrivateKeyCached,
    selfSigningPrivateKeyCached,
    userSigningPrivateKeyCached,
    homeserverSupportsCrossSigning,
    crossSigningReady,
  });

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

export async function isDeviceVerified(matrixClient: MatrixClient) {
  const deviceId = matrixClient.getDeviceId();
  if (!deviceId) {
    logger.warn("Unable to verify device: MatrixClient is missing deviceId.");
    return false;
  }
  const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
  const trustLevel = await cryptoApi.getDeviceVerificationStatus(
    matrixClient.getSafeUserId(),
    deviceId,
  );
  if (!trustLevel) {
    logger.warn(
      "Unable to verify device: Device is unknown, or has not published any encryption keys.",
    );
    return false;
  }

  return trustLevel.crossSigningVerified;
}

/**
 * Generates a 256-bit hash (SHA-256) from the combined string of the user's ID and device ID.
 * This hash is returned as a Uint8Array representing the storage key.
 */
export async function createStorageKey(
  selfUserId: string,
  deviceId: string,
  selfUserDeriveKeySecret: string,
) {
  const combinedString = `${selfUserId}:${deviceId}:${selfUserDeriveKeySecret}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(combinedString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);

  return hashArray;
}

/**
 * NOTE: We want UUID created with cryptographically secure random number
 * generator which standard RFC9562 UUIDs generator does not provide.
 */
export function generateCryptoRandomUUID() {
  // eslint-disable-next-line no-restricted-properties
  return crypto.randomUUID();
}

export function getCryptoApi(matrixClient: MatrixClient) {
  const cryptoApi = matrixClient.getCrypto();
  if (!cryptoApi) {
    throw new Error("CryptoApi is not initialized - first call initRustCrypto");
  }
  return cryptoApi;
}
