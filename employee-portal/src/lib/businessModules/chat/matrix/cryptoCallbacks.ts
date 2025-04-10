/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, SecretStorage } from "matrix-js-sdk";
import { deriveKey } from "matrix-js-sdk/lib/crypto/key_passphrase";
import { isEmpty, isString } from "remeda";

import { logger } from "@/lib/businessModules/chat/shared/helpers";

const secretStorageKeys: Record<string, Uint8Array> = {};
const secretStorageKeyInfo: Record<
  string,
  SecretStorage.SecretStorageKeyDescription
> = {};

export async function getSecretStorageKeyFromCache(
  {
    keys: keyInfos,
  }: {
    keys: Record<string, SecretStorage.SecretStorageKeyDescription>;
  },
  matrixClient: MatrixClient,
  passphrase?: string,
  disableCache = false,
): Promise<[string, Uint8Array]> {
  let keyId = await matrixClient.secretStorage.getDefaultKeyId();
  let keyInfo: SecretStorage.SecretStorageKeyDescription | undefined;

  logger.debug("Getting secretStorage key from cache", keyId);

  if (keyId) {
    keyInfo = keyInfos[keyId];
    if (!keyInfo) {
      keyId = null;
    }
  }

  if (!keyId) {
    const keyInfoEntries = Object.entries(keyInfos);
    if (keyInfoEntries.length > 1) {
      throw new Error("Multiple storage key requests not implemented");
    }

    if (keyInfoEntries[0]) {
      [keyId, keyInfo] = keyInfoEntries[0];
    }
  }

  // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
  if (!keyId || !keyInfo) return Promise.reject();

  // Check the in-memory cache
  const cachedKey = secretStorageKeys[keyId];
  if (cachedKey) {
    logger.debug(
      `getSecretStorageKeyFromCache: returning key ${keyId} from cache`,
    );
    return [keyId, cachedKey];
  }

  if (!isString(passphrase) || isEmpty(passphrase)) {
    throw new Error("Invalid passphrase - unable to get secret storage key.");
  }

  const restoredKey = await deriveKey(
    passphrase,
    keyInfo.passphrase.salt,
    keyInfo.passphrase.iterations,
  );

  logger.debug({ restoredKey });

  // Save to cache to avoid future prompts in the current session
  if (!disableCache) {
    saveSecretStorageKeyToCache(keyId, keyInfo, restoredKey);
  }

  return [keyId, restoredKey];
}

export function saveSecretStorageKeyToCache(
  keyId: string,
  keyInfo: SecretStorage.SecretStorageKeyDescription,
  key: Uint8Array,
): void {
  logger.debug("Caching secretStorage key", { keyId, keyInfo, key });
  secretStorageKeys[keyId] = key;
  secretStorageKeyInfo[keyId] = keyInfo;
}
