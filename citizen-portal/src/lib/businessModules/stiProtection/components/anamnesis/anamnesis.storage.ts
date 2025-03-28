/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import Crypto from "crypto";

import { FormDataWithoutConcern } from "./AnamnesisStepper.config";

const ANAMNESIS_FORM = "anamnesis-form";
const dummyKeyPlainText = "SLOyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=";
// Encryption key needs to be securely stored (e.g., ENV, KMS, etc.)
const cipherKeyPlainText = dummyKeyPlainText; // process.ENV.BROWSER_STORAGE_CIPHER_KEY;
const cipherKey = Buffer.from(cipherKeyPlainText, "base64");
const encodingTypeEncrypted: BufferEncoding = "base64";
const encodingTypeInput: BufferEncoding = "utf8";
const cipherAlgorithm = "aes-256-cbc";

function encrypt(plaintext: string) {
  const iv = Crypto.randomBytes(16);
  const cipher = Crypto.createCipheriv(cipherAlgorithm, cipherKey, iv);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(plaintext, encodingTypeInput),
    cipher.final(),
  ]);

  return encrypted.toString(encodingTypeEncrypted);
}

function decrypt(ivCipherTextBase64: string) {
  const ivCipherText = Buffer.from(ivCipherTextBase64, encodingTypeEncrypted);
  const iv = ivCipherText.subarray(0, 16);
  const cipherText = ivCipherText.subarray(16);
  const cipher = Crypto.createDecipheriv(cipherAlgorithm, cipherKey, iv);
  const decrypted = Buffer.concat([cipher.update(cipherText), cipher.final()]);

  return decrypted.toString(encodingTypeInput);
}

export function getAnamnesisForm(): FormDataWithoutConcern | null {
  let result = null;

  if (typeof window === "undefined") return result;

  const anamnesisFormEncrypted = window.sessionStorage.getItem(ANAMNESIS_FORM);

  if (anamnesisFormEncrypted) {
    const anamnesisForm = decrypt(anamnesisFormEncrypted);

    result = JSON.parse(anamnesisForm) as FormDataWithoutConcern;
  }

  return result;
}

export function setAnamnesisForm(anamnesisForm?: FormDataWithoutConcern): void {
  if (typeof window === "undefined") return;

  if (anamnesisForm) {
    const anamnesisFormString = JSON.stringify(anamnesisForm);
    const anamnesisFormEncrypted = encrypt(anamnesisFormString);

    window.sessionStorage.setItem(ANAMNESIS_FORM, anamnesisFormEncrypted);
  } else {
    window.sessionStorage.removeItem(ANAMNESIS_FORM);
  }
}
