/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createClient } from "matrix-js-sdk";
import { isNonNullish } from "remeda";

import { IStoredCredentials } from "@/lib/businessModules/chat/shared/types";

const USER_ID_STORAGE_KEY = "mx_user_id";
const DEVICE_ID_STORAGE_KEY = "mx_device_id";

export function getCachedCredentials() {
  const deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY) ?? undefined;
  const userId = localStorage.getItem(USER_ID_STORAGE_KEY) ?? undefined;

  return { deviceId, userId };
}

export function getIDBFactory(): IDBFactory | undefined {
  return self?.indexedDB ? self.indexedDB : window.indexedDB;
}

export function persistCredentials(credentials: Partial<IStoredCredentials>) {
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

export function clearCachedCredentials() {
  clearLocalStorage();
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
  await temporaryMatrixClient.clearStores();
}

export async function checkIfDatabaseExists(dbName: string) {
  const databases = await getIDBFactory()?.databases();
  return Boolean(databases?.some((db) => db.name === dbName));
}

export async function checkIfLocalStorageDataExists() {
  return (
    (await checkIfDatabaseExists("matrix-js-sdk::matrix-sdk-crypto")) &&
    isNonNullish(getCachedCredentials().deviceId)
  );
}
