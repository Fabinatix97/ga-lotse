/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, SecretStorage } from "matrix-js-sdk";
import {
  decodeRecoveryKey,
  deriveRecoveryKeyFromPassphrase,
} from "matrix-js-sdk/lib/crypto-api";
import { isEmpty } from "remeda";

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
  recoveryKey?: string,
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

  let secretStorageKey = undefined;
  if (!isEmpty(recoveryKey)) {
    secretStorageKey = decodeRecoveryKey(recoveryKey);
  } else if (!isEmpty(passphrase)) {
    secretStorageKey = await deriveRecoveryKeyFromPassphrase(
      passphrase,
      keyInfo.passphrase.salt,
      keyInfo.passphrase.iterations,
    );
  } else {
    throw new Error(
      "Invalid passphrase or recovery key - unable to get secret storage key.",
    );
  }

  // Save to cache to avoid future prompts in the current session
  if (!disableCache) {
    saveSecretStorageKeyToCache(keyId, keyInfo, secretStorageKey);
  }

  return [keyId, secretStorageKey];
}

export function saveSecretStorageKeyToCache(
  keyId: string,
  keyInfo: SecretStorage.SecretStorageKeyDescription,
  key: Uint8Array,
): void {
  secretStorageKeys[keyId] = key;
  secretStorageKeyInfo[keyId] = keyInfo;
}
