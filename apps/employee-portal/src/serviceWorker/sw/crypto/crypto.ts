/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { validatePassword } from "@/serviceWorker/common/validatePassword";
import { getKey } from "@/serviceWorker/sw/crypto/getKey";
import { createSalt, restoreSalt } from "@/serviceWorker/sw/crypto/saltStore";

/** for AES-GCM an IV length of 96bits is recommended, see https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams#iv */
const IV_LENGTH = 96 / 8;

export async function encrypt(data: ArrayBufferLike) {
  return encryptWithKey(data, await getKey());
}

export async function encryptWithKey(data: ArrayBufferLike, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const cypher = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data,
  );
  return concatBuffers(iv, cypher);
}

export async function decrypt(data: ArrayBufferLike): Promise<ArrayBufferLike> {
  return decryptWithKey(data, await getKey(data));
}

export async function decryptWithKey(
  data: ArrayBufferLike,
  key: CryptoKey | Promise<CryptoKey>,
): Promise<ArrayBufferLike> {
  const iv = data.slice(0, IV_LENGTH);
  const cipher = data.slice(IV_LENGTH);
  return await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    await key,
    cipher,
  );
}

export async function createNewKeyFromPassword(password: string) {
  const salt = await createSalt();
  return deriveKey(password, salt);
}

export async function recreateExistingKeyFromPassword(password: string) {
  const salt = await restoreSalt();
  return deriveKey(password, salt);
}

async function deriveKey(password: string, salt: ArrayBufferLike) {
  if (validatePassword(password) !== undefined) {
    throw new Error("Password to weak");
  }
  if (salt.byteLength < 16) {
    throw new Error("Salt too short");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    toArrayBuffer(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt,
      iterations: 650000,
    },
    key,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"],
  );
}

function concatBuffers(buffer1: ArrayBufferLike, buffer2: ArrayBufferLike) {
  const concatenated = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  concatenated.set(new Uint8Array(buffer1), 0);
  concatenated.set(new Uint8Array(buffer2), buffer1.byteLength);
  return concatenated.buffer;
}

const textEncoder = new TextEncoder();

function toArrayBuffer(str: string): ArrayBufferLike {
  return textEncoder.encode(str);
}
