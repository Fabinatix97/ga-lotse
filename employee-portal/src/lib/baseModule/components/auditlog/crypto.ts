/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiEmployeeUserKeys } from "@eshg/employee-portal-api/base";
import { AeadId, CipherSuite, KdfId, KemId } from "hpke-js";

export async function generateKeyPairs(
  password: string,
): Promise<ApiEmployeeUserKeys> {
  const suite = new CipherSuite({
    kem: KemId.DhkemP256HkdfSha256,
    kdf: KdfId.HkdfSha256,
    aead: AeadId.Aes128Gcm,
  });
  const keyPair = await suite.kem.generateKeyPair();

  const publicKeyRaw = await suite.kem.serializePublicKey(keyPair.publicKey);
  const publicKey = new Int8Array(publicKeyRaw);
  const publicKeyHash = new Uint8Array(
    await window.crypto.subtle.digest("SHA-256", publicKeyRaw),
  );

  const encryptedPrivateKey = await encryptPrivateKey(
    keyPair.privateKey,
    password,
  );

  return {
    publicKey: signedIntByteArrayToDecimalView(publicKey),
    keyIdentifier: unsignedIntByteArrayToHexaDecimalView(publicKeyHash),
    encryptedPrivateKey: signedIntByteArrayToDecimalView(encryptedPrivateKey),
    cryptoVersion: 1,
  };
}

async function encryptPrivateKey(privateKey: CryptoKey, password: string) {
  const { wrappingKey, salt } = await deriveWrappingKeyFromPassword(password);

  const { encryptedPrivateKeyRaw, iv } = await wrapAndEncryptPrivateKey(
    privateKey,
    wrappingKey,
  );

  const encryptedPrivateKey = new Int8Array(
    salt.byteLength + iv.byteLength + encryptedPrivateKeyRaw.byteLength,
  );
  encryptedPrivateKey.set(new Int8Array(salt));
  encryptedPrivateKey.set(new Int8Array(iv), salt.byteLength);
  encryptedPrivateKey.set(
    new Int8Array(encryptedPrivateKeyRaw),
    salt.byteLength + iv.byteLength,
  );
  return encryptedPrivateKey;
}

async function wrapAndEncryptPrivateKey(
  privateKey: CryptoKey,
  wrappingKey: CryptoKey,
) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedPrivateKeyRaw = await window.crypto.subtle.wrapKey(
    "pkcs8",
    privateKey,
    wrappingKey,
    { name: "AES-GCM", iv: iv },
  );
  return { encryptedPrivateKeyRaw, iv };
}

async function deriveWrappingKeyFromPassword(password: string) {
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"],
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const wrappingKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 650000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["wrapKey", "unwrapKey"],
  );
  return { wrappingKey, salt };
}

// open api format attribute is ignored
// see https://github.com/openapi-ts/openapi-typescript/issues/1214
function signedIntByteArrayToDecimalView(byteArray: Int8Array) {
  return Array.from(byteArray).map((byte) => byte.toString(10));
}

function unsignedIntByteArrayToHexaDecimalView(byteArray: Uint8Array) {
  return Array.from(byteArray)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
