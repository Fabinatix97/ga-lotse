/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createClient } from "matrix-js-sdk";
import {
  IEncryptedPayload,
  decryptAES,
  encryptAES,
} from "matrix-js-sdk/lib/crypto/aes";

import {
  idbClearTable,
  idbDeleteDb,
  idbLoad,
  idbSave,
} from "@/lib/businessModules/chat/matrix/idb";
import { getPickleKey } from "@/lib/businessModules/chat/matrix/pickling";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { IStoredCredentials } from "@/lib/businessModules/chat/shared/types";

const ACCESS_TOKEN_STORAGE_KEY = "mx_access_token";
const USER_ID_STORAGE_KEY = "mx_user_id";
const DEVICE_ID_STORAGE_KEY = "mx_device_id";

export const ACCESS_TOKEN_IV = "access_token";

export function getIDBFactory(): IDBFactory | undefined {
  return self?.indexedDB ? self.indexedDB : window.indexedDB;
}

export async function getCachedCredentials() {
  let accessToken = await getCachedAccessToken(ACCESS_TOKEN_STORAGE_KEY);
  const deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY) ?? undefined;
  const userId = localStorage.getItem(USER_ID_STORAGE_KEY) ?? undefined;

  let pickleKey: string | undefined;

  if (deviceId && userId) {
    pickleKey = (await getPickleKey(userId, deviceId)) ?? undefined;
  }

  accessToken = await tryDecryptToken(pickleKey, accessToken, ACCESS_TOKEN_IV);

  return { accessToken, deviceId, userId };
}

export async function persistCredentials(
  credentials: Partial<IStoredCredentials>,
) {
  if (credentials.accessToken) {
    await cacheAccessToken(credentials);
  }

  if (localStorage) {
    if (credentials.deviceId) {
      localStorage.setItem(DEVICE_ID_STORAGE_KEY, credentials.deviceId);
    }
    if (credentials.userId) {
      localStorage.setItem(USER_ID_STORAGE_KEY, credentials.userId);
    }
  }
}

export function clearLocalStorage() {
  if (localStorage) {
    localStorage.removeItem(DEVICE_ID_STORAGE_KEY);
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }
}

export async function clearCachedCredentials() {
  clearLocalStorage();
  await idbClearTable("pickleKey");
  await idbClearTable("account");
}

export async function deleteCachedCredentials() {
  try {
    clearLocalStorage();
    await idbDeleteDb();
  } catch {
    // eslint-disable-next-line no-console
    console.warn("Cached credentials were not cleared");
  }
}

/**
 * Retrieve a token, as stored by `persistCredentials`
 * Attempts to migrate token from localStorage to idb
 */
async function getCachedAccessToken(storageKey: string) {
  let token: IEncryptedPayload | string | undefined;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    token = await idbLoad("account", storageKey);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`idbLoad failed to read: ${storageKey}`, e);
  }

  if (!token) {
    token = localStorage.getItem(storageKey) ?? undefined;
    if (token) {
      try {
        // try to migrate access token to IndexedDB if we can
        await idbSave("account", storageKey, token);
        localStorage.removeItem(storageKey);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(
          `migration of token ${storageKey} to IndexedDB failed`,
          e,
        );
      }
    }
  }
  return token;
}

async function cacheAccessToken(credentials: Partial<IStoredCredentials>) {
  const { accessToken, deviceId, userId } = credentials;

  if (deviceId && userId && accessToken) {
    const pickleKey = await getPickleKey(userId, deviceId);

    if (pickleKey) {
      let encryptedAccessToken: IEncryptedPayload | null = null;

      try {
        const aesKey = await pickleKeyToAesKey(pickleKey);
        encryptedAccessToken = await encryptAES(
          accessToken,
          aesKey,
          ACCESS_TOKEN_IV,
        );
        aesKey.fill(0); // needs to zero it after using
      } catch {
        // eslint-disable-next-line no-console
        console.error("Could not encrypt access token");
      }

      try {
        // save either the encrypted access token, or the plain access
        // token if we were unable to encrypt (e.g. if the browser doesn't
        // have WebCrypto).
        await idbSave(
          "account",
          ACCESS_TOKEN_STORAGE_KEY,
          encryptedAccessToken ?? accessToken,
        );
      } catch {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
      }
    } else {
      try {
        await idbSave("account", ACCESS_TOKEN_STORAGE_KEY, accessToken);
      } catch {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
      }
    }
  }
}

/**
 * The pickle key is a string of unspecified length and format. For AES, we need a 256-bit Uint8Array.
 * So we HKDF the pickle key to generate the AES key.  The AES key should be zeroed after it is used.
 */
async function pickleKeyToAesKey(pickleKey: string) {
  const pickleKeyBuffer = new Uint8Array(pickleKey.length);
  for (let i = 0; i < pickleKey.length; i++) {
    pickleKeyBuffer[i] = pickleKey.charCodeAt(i);
  }
  const hkdfKey = await crypto.subtle.importKey(
    "raw",
    pickleKeyBuffer,
    "HKDF",
    false,
    ["deriveBits"],
  );
  pickleKeyBuffer.fill(0);
  return new Uint8Array(
    await crypto.subtle.deriveBits(
      {
        name: "HKDF",
        hash: "SHA-256",
        salt: new Uint8Array(32),
        info: new Uint8Array(0),
      },
      hkdfKey,
      256,
    ),
  );
}

function isEncryptedPayload(
  token?: IEncryptedPayload | string,
): token is IEncryptedPayload {
  return !!token && typeof token !== "string";
}

/**
 * Try to decrypt a token retrieved from storage
 * Where token is not encrypted (plain text) returns the plain text token
 * Where token is encrypted, attempts decryption. Returns successfully decrypted token, else undefined.
 */
async function tryDecryptToken(
  pickleKey: string | undefined,
  token: IEncryptedPayload | string | undefined,
  tokenIv: string,
): Promise<string | undefined> {
  if (pickleKey && isEncryptedPayload(token)) {
    const aesKey = await pickleKeyToAesKey(pickleKey);
    const decryptedToken = await decryptAES(token, aesKey, tokenIv);
    aesKey.fill(0);
    return decryptedToken;
  }
  // if the token wasn't encrypted (plain string) just return it back
  if (typeof token === "string") {
    return token;
  }
  // otherwise return undefined
}

export function updateLocalStorageDeviceId(deviceId: string) {
  if (localStorage) {
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  }
}

export async function clearMatrixStores(): Promise<void> {
  const temporaryMatrixClient = createClient({
    baseUrl: "",
  });

  const promises: Promise<void>[] = [];

  promises.push(temporaryMatrixClient.store.deleteAllData());

  async function deleteRustSdkStore(): Promise<void> {
    let indexedDB: IDBFactory | undefined;
    try {
      indexedDB = getIDBFactory();
      if (!indexedDB) return;
    } catch {
      return;
    }

    for (const dbName of [
      `matrix-js-sdk::matrix-sdk-crypto`,
      `matrix-js-sdk::matrix-sdk-crypto-meta`,
    ]) {
      const prom = new Promise((resolve) => {
        const req = indexedDB.deleteDatabase(dbName);
        req.onsuccess = (): void => {
          resolve(0);
          logger.info("Crypto DB deleted");
        };
        req.onerror = (): void => {
          resolve(0);
          logger.info("Crypto DB deletion failed");
        };
        req.onblocked = (): void => {
          req.result?.close();
          logger.info("Crypto DB is blocked");
        };
      });
      await prom;
    }
  }

  promises.push(deleteRustSdkStore());
  await Promise.all(promises);
}
