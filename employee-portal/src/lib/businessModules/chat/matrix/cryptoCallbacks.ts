/**
 * Copyright 2024 cronn GmbH
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

export async function getSecretStorageKey(
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

  logger.info("GET SECRET STORAGE - getDefaultKeyId", keyId);

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
    logger.debug(`getSecretStorageKey: returning key ${keyId} from cache`);
    return [keyId, cachedKey];
  }

  if (!isString(passphrase) || isEmpty(passphrase)) {
    throw new Error("Invalid passphrase - unable to get secret storage key.");
  }

  const key = await deriveKey(
    passphrase,
    keyInfo.passphrase.salt,
    keyInfo.passphrase.iterations,
  );

  logger.debug({ restoredKey: key });

  // Save to cache to avoid future prompts in the current session
  if (!disableCache) {
    cacheSecretStorageKey(keyId, keyInfo, key);
  }

  return [keyId, key];
}

export function cacheSecretStorageKey(
  keyId: string,
  keyInfo: SecretStorage.SecretStorageKeyDescription,
  key: Uint8Array,
): void {
  logger.info("CACHE SECRET STORAGE", { keyId, keyInfo, key });

  secretStorageKeys[keyId] = key;
  secretStorageKeyInfo[keyId] = keyInfo;
}
