/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { encodeUnpaddedBase64 } from "matrix-js-sdk/lib/base64";

import {
  idbClearTable,
  idbLoad,
  idbSave,
} from "@/lib/businessModules/chat/matrix/idb";

export interface EncryptedPickleKey {
  /** The encrypted payload. */
  encrypted?: BufferSource;

  /** Initialisation vector for the encryption. */
  iv?: BufferSource;

  /** The encryption key which was used to encrypt the payload. */
  cryptoKey?: CryptoKey;
}

/**
 * Get a previously stored pickle key. The pickle key is used for
 * encrypting react-sdk-crypto data.
 */
export async function getPickleKey(
  userId: string,
  deviceId: string,
): Promise<string | null> {
  let data: EncryptedPickleKey | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    data = await idbLoad("pickleKey", [userId, deviceId]);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("idbLoad for pickleKey failed", e);
  }

  return (await buildAndEncodePickleKey(data, userId, deviceId)) ?? null;
}

/**
 * Create and store a pickle key for encrypting libolm objects.
 */
export async function createPickleKey(
  userId: string,
  deviceId: string,
): Promise<string | null> {
  const randomArray = new Uint8Array(32);
  crypto.getRandomValues(randomArray);
  const data = await encryptPickleKey(randomArray, userId, deviceId);
  if (data === undefined) {
    // no crypto support
    return null;
  }

  try {
    await idbClearTable("pickleKey");
    await idbSave("pickleKey", [userId, deviceId], data);
  } catch {
    return null;
  }
  return encodeUnpaddedBase64(randomArray);
}

/**
 * Calculates the `additionalData` for the AES-GCM key used by the pickling processes. This
 * additional data is *not* encrypted, but *is* authenticated. The additional data is constructed
 * from the user ID and device ID provided.
 *
 * The later-constructed pickle key is used to decrypt values, such as access tokens, from IndexedDB.
 */
function getPickleAdditionalData(userId: string, deviceId: string): Uint8Array {
  const additionalData = new Uint8Array(userId.length + deviceId.length + 1);
  for (let i = 0; i < userId.length; i++) {
    additionalData[i] = userId.charCodeAt(i);
  }
  additionalData[userId.length] = 124;
  for (let i = 0; i < deviceId.length; i++) {
    additionalData[userId.length + 1 + i] = deviceId.charCodeAt(i);
  }
  return additionalData;
}

/**
 * Encrypt the given pickle key, ready for storage in the database.
 */
async function encryptPickleKey(
  pickleKey: Uint8Array,
  userId: string,
  deviceId: string,
): Promise<EncryptedPickleKey | undefined> {
  if (!crypto?.subtle) {
    return undefined;
  }
  const cryptoKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  const iv = new Uint8Array(32);
  crypto.getRandomValues(iv);

  const additionalData = getPickleAdditionalData(userId, deviceId);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData },
    cryptoKey,
    pickleKey,
  );
  return { encrypted, iv, cryptoKey };
}

/**
 * Decrypts the provided data into a pickle key and base64-encodes it ready for use elsewhere.
 *
 * If `data` is undefined in part or in full, returns undefined.
 *
 * If crypto functions are not available, returns undefined regardless of input.
 *
 */
async function buildAndEncodePickleKey(
  data: EncryptedPickleKey | undefined,
  userId: string,
  deviceId: string,
): Promise<string | undefined> {
  if (!crypto?.subtle) {
    return undefined;
  }
  if (!data?.encrypted || !data.iv || !data.cryptoKey) {
    return undefined;
  }

  try {
    const additionalData = getPickleAdditionalData(userId, deviceId);
    const pickleKeyBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: data.iv, additionalData },
      data.cryptoKey,
      data.encrypted,
    );
    if (pickleKeyBuf) {
      return encodeUnpaddedBase64(pickleKeyBuf);
    }
  } catch {
    // eslint-disable-next-line no-console
    console.error("Error decrypting pickle key");
  }

  return undefined;
}
