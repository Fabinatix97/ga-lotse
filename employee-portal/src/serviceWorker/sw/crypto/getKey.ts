/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { PROCESS_ABORTED } from "@/serviceWorker/common/common";
import {
  GET_EXISTING_PASSWORD,
  GET_PASSWORD,
  GET_PASSWORD_ABORTED,
  PASSWORD_ACCEPTED,
  REGISTER_CLIENT,
  createOfflinePasswordBroadCastChannelEndpoint,
  isPasswordMessage,
  isPreemptivePasswordMessage,
} from "@/serviceWorker/common/offlinePasswordBroadCastChannel";
import { getAnyDataRaw } from "@/serviceWorker/sw/cache";
import { KEY_TIMEOUT_IN_MS } from "@/serviceWorker/sw/config";
import {
  createNewKeyFromPassword,
  decryptWithKey,
  recreateExistingKeyFromPassword,
} from "@/serviceWorker/sw/crypto/crypto";

let key: Promise<CryptoKey> | undefined;
let keyTimeout: ReturnType<typeof setTimeout>;

const offlinePasswordChannel = createOfflinePasswordBroadCastChannelEndpoint();

offlinePasswordChannel.addEventListener("message", (m) => {
  // So tests can use `new BroadcastChannel("offline-password").postMessage("delete-password")` to clear the password
  if (m.data === "delete-password") {
    deleteKey();
  } else if (isPreemptivePasswordMessage(m.data)) {
    const { password } = m.data;
    const newKey = createNewKeyFromPassword(password);
    if (key) {
      throw new Error("Key already exists");
    }
    clearTimeout(keyTimeout);
    keyTimeout = setTimeout(deleteKey, KEY_TIMEOUT_IN_MS);
    key = Promise.resolve(newKey);
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
  reject: (reason: Error) => void,
) {
  offlinePasswordChannel.onmessage = (ev) => {
    if (isPasswordMessage(ev.data)) {
      const { password } = ev.data;
      const newKey = createNewKeyFromPassword(password);
      resolve(newKey);
      offlinePasswordChannel.onmessage = null;
      offlinePasswordChannel.postMessage(PASSWORD_ACCEPTED);
    } else if (ev.data === GET_PASSWORD_ABORTED) {
      reject(new Error(PROCESS_ABORTED));
      offlinePasswordChannel.onmessage = null;
      deleteKey();
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
      const { password } = ev.data;
      const newKey = recreateExistingKeyFromPassword(password);
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
    } else if (ev.data === GET_PASSWORD_ABORTED) {
      reject(new Error("Vorgang abgebrochen"));
      offlinePasswordChannel.onmessage = null;
      deleteKey();
    } else if (ev.data === REGISTER_CLIENT) {
      offlinePasswordChannel.postMessage(GET_EXISTING_PASSWORD);
    }
  };
  offlinePasswordChannel.postMessage(GET_EXISTING_PASSWORD);
}
