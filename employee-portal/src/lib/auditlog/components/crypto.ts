/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetEncryptedSymmetricKeyResponse } from "@eshg/employee-portal-api/auditlog";
import { ApiEmployeeUserKeys } from "@eshg/employee-portal-api/base";
import { AeadId, CipherSuite, KdfId, KemId } from "hpke-js";

const suite = new CipherSuite({
  kem: KemId.DhkemP256HkdfSha256,
  kdf: KdfId.HkdfSha256,
  aead: AeadId.Aes256Gcm,
});

const keyFormat = "pkcs8";
const keygenAlgorithm = "PBKDF2";
const encryptionAlgorithm = "AES-GCM";
const hashAlgorithm = "SHA-256";

const saltLength = 16;
const ivLength = 12;
const privateKeyOffset = saltLength + ivLength;

export async function generateKeyPairs(
  password: string,
): Promise<ApiEmployeeUserKeys> {
  const keyPair = await suite.kem.generateKeyPair();

  const publicKeyRaw = await suite.kem.serializePublicKey(keyPair.publicKey);
  const publicKey = new Int8Array(publicKeyRaw);
  const publicKeyHash = new Uint8Array(
    await window.crypto.subtle.digest(hashAlgorithm, publicKeyRaw),
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
  const salt = window.crypto.getRandomValues(new Uint8Array(saltLength));
  const wrappingKey = await deriveWrappingKeyFromPassword(password, salt, [
    "deriveBits",
    "deriveKey",
  ]);

  const { encryptedPrivateKeyRaw, iv } = await wrapPrivateKey(
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

async function wrapPrivateKey(privateKey: CryptoKey, wrappingKey: CryptoKey) {
  const iv = window.crypto.getRandomValues(new Uint8Array(ivLength));

  const encryptedPrivateKeyRaw = await window.crypto.subtle.wrapKey(
    keyFormat,
    privateKey,
    wrappingKey,
    { name: encryptionAlgorithm, iv: iv },
  );
  return { encryptedPrivateKeyRaw, iv };
}

async function deriveWrappingKeyFromPassword(
  password: string,
  salt: BufferSource,
  passwordKeyUsages: KeyUsage[],
) {
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: keygenAlgorithm },
    false,
    passwordKeyUsages,
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: keygenAlgorithm,
      salt: salt,
      iterations: 650000,
      hash: hashAlgorithm,
    },
    passwordKey,
    { name: encryptionAlgorithm, length: 256 },
    true,
    ["wrapKey", "unwrapKey"],
  );
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

export async function decryptSymmetricKey(
  decryptedPrivateKey: CryptoKey,
  encryptedSymmetricKeyResponse: ApiGetEncryptedSymmetricKeyResponse,
): Promise<string> {
  const recipient = await suite.createRecipientContext({
    recipientKey: decryptedPrivateKey,
    enc: decimalViewToSignedIntByteArray(
      encryptedSymmetricKeyResponse.encapsulatedKey,
    ),
  });

  const decryptedSymmetricKey = await recipient.open(
    decimalViewToSignedIntByteArray(
      encryptedSymmetricKeyResponse.encryptedSymmetricKey,
    ),
  );

  return btoa(String.fromCharCode(...new Uint8Array(decryptedSymmetricKey)));
}

export async function unwrapPrivateKey(
  encryptedPrivateKey: string[],
  password: string,
) {
  const decodedEncryptedPrivateKey =
    decimalViewToSignedIntByteArray(encryptedPrivateKey);

  const salt = decodedEncryptedPrivateKey.slice(0, saltLength);
  const iv = decodedEncryptedPrivateKey.slice(saltLength, privateKeyOffset);
  const privateKey = decodedEncryptedPrivateKey.slice(privateKeyOffset);

  const wrappingKey = await deriveWrappingKeyFromPassword(password, salt, [
    "deriveKey",
  ]);

  return await crypto.subtle.unwrapKey(
    keyFormat,
    privateKey,
    wrappingKey,
    { name: encryptionAlgorithm, iv: iv },
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
}

function decimalViewToSignedIntByteArray(decimalView: string[]) {
  const int8Array = new Int8Array(decimalView.length);
  int8Array.set(decimalView.map((value) => parseInt(value, 10)));
  return int8Array;
}
