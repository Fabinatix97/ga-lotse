/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GET_EXISTING_PASSWORD,
  GET_PASSWORD,
  GET_PASSWORD_FAILED,
  PASSWORD_ACCEPTED,
  REGISTER_CLIENT,
  createOfflinePasswordBroadCastChannelEndpoint,
  isPasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";
import { getAnyDataRaw } from "@/serviceWorker/sw/cache";
import { KEY_TIMEOUT_IN_MS } from "@/serviceWorker/sw/config";
import { decryptWithKey, deriveKey } from "@/serviceWorker/sw/crypto/crypto";

let key: Promise<CryptoKey> | undefined;
let keyTimeout: ReturnType<typeof setTimeout>;

const offlinePasswordChannel = createOfflinePasswordBroadCastChannelEndpoint();

// So tests can use `new BroadcastChannel("offline-password").postMessage("delete-password")` to clear the password
offlinePasswordChannel.addEventListener("message", (m) => {
  if (m.data === "delete-password") {
    deleteKey();
  }
});

function deleteKey() {
  key = undefined;
}

export function getKey(cipher?: ArrayBufferLike): Promise<CryptoKey> {
  clearTimeout(keyTimeout);
  keyTimeout = setTimeout(deleteKey, KEY_TIMEOUT_IN_MS);
  if (key) return key;
  const encryptedDataPromise = cipher
    ? Promise.resolve(cipher)
    : getAnyDataRaw();
  key = encryptedDataPromise.then(
    (encryptedData) => new Promise<CryptoKey>(getKeyExecutor(encryptedData)),
  );
  return key;
}

function getKeyExecutor(encryptedData: ArrayBufferLike | undefined) {
  if (!encryptedData) {
    return getNewKey;
  }
  return (
    resolve: (value: CryptoKey | PromiseLike<CryptoKey>) => void,
    reject: () => void,
  ) => getExistingKey(encryptedData, resolve, reject);
}

function getNewKey(
  resolve: (value: CryptoKey | PromiseLike<CryptoKey>) => void,
) {
  offlinePasswordChannel.onmessage = (ev) => {
    if (isPasswordMessage(ev.data)) {
      const { password, salt } = ev.data;
      const newKey = deriveKey(password, salt);
      resolve(newKey);
      offlinePasswordChannel.onmessage = null;
      offlinePasswordChannel.postMessage(PASSWORD_ACCEPTED);
    } else if (ev.data === REGISTER_CLIENT) {
      offlinePasswordChannel.postMessage(GET_PASSWORD);
    }
  };
  offlinePasswordChannel.postMessage(GET_PASSWORD);
}

function getExistingKey(
  encryptedData: ArrayBuffer,
  resolve: (value: CryptoKey | PromiseLike<CryptoKey>) => void,
  reject: (reason: Error) => void,
) {
  offlinePasswordChannel.onmessage = (ev) => {
    if (isPasswordMessage(ev.data)) {
      const { password, salt } = ev.data;
      const newKey = deriveKey(password, salt);
      decryptWithKey(encryptedData, newKey).then(
        () => {
          resolve(newKey);
          offlinePasswordChannel.onmessage = null;
          offlinePasswordChannel.postMessage(PASSWORD_ACCEPTED);
        },
        () => {
          offlinePasswordChannel.postMessage(GET_EXISTING_PASSWORD);
        },
      );
    } else if (ev.data === GET_PASSWORD_FAILED) {
      reject(new Error("Falsches Passwort"));
      deleteKey();
    } else if (ev.data === REGISTER_CLIENT) {
      offlinePasswordChannel.postMessage(GET_EXISTING_PASSWORD);
    }
  };
  offlinePasswordChannel.postMessage(GET_EXISTING_PASSWORD);
}
