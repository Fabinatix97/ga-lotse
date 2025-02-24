/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient } from "matrix-js-sdk";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

export async function fetchBackupInfo(matrixClient: MatrixClient) {
  const crypto = matrixClient.getCrypto();
  if (!crypto) throw new Error("CryptoApi is undefined");

  const keyBackupInfo = await crypto.getKeyBackupInfo();
  const has4SKey = await matrixClient.secretStorage.hasKey();
  const has4SBackupKeyStored = has4SKey
    ? !!(await matrixClient.isKeyBackupKeyStored())
    : false;

  logger.debug("fetchBackupInfo", {
    has4SBackupKeyStored,
    keyBackupInfo,
    has4SKey,
  });

  return { keyBackupInfo, has4SKey, has4SBackupKeyStored };
}

export async function getBackupKeyStatus(matrixClient: MatrixClient) {
  const crypto = matrixClient.getCrypto();
  if (!crypto) return;

  const serverSideSecretStorage = matrixClient.secretStorage;

  const isKeyBackupKeyStored = await matrixClient.isKeyBackupKeyStored();

  const backupKeyStored = !!isKeyBackupKeyStored;
  const backupKeyFromCache = await crypto.getSessionBackupPrivateKey();
  const backupKeyCached = !!backupKeyFromCache;
  const backupKeyWellFormed = backupKeyFromCache instanceof Uint8Array;
  const secretStorageKeyInAccount = await serverSideSecretStorage.hasKey();
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

export async function isDeviceVerified(client: MatrixClient) {
  const crypto = client.getCrypto();
  if (!crypto) {
    logger.warn("Unable to verify device: RustCrypto is not yet initialized.");
    return false;
  }

  const deviceId = client.getDeviceId();
  if (!deviceId) {
    logger.warn("Unable to verify device: MatrixClient is missing deviceId.");
    return false;
  }

  const trustLevel = await crypto.getDeviceVerificationStatus(
    client.getSafeUserId(),
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
export async function createStorageKey(selfUserId: string, deviceId: string) {
  const combinedString = `${selfUserId}:${deviceId}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(combinedString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = new Uint8Array(hashBuffer);

  return hashArray;
}

/**
 * Generates a random 256-bit storage key (32 bytes) using the cryptographic random number generator.
 */
export function generateStorageKey() {
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  return key;
}
