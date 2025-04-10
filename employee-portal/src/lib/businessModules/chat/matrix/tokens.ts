/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isNonNullish } from "remeda";

import { createTemporaryMatrixClient } from "@/lib/businessModules/chat/matrix/login";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { UserDevice } from "@/lib/businessModules/chat/shared/types";

const USER_ID_STORAGE_KEY = "mx_user_id";
const DEVICE_ID_STORAGE_KEY = "mx_device_id";

export function getUserDeviceFromLocalStorage(): UserDevice | undefined {
  const deviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY) ?? undefined;
  const userId = localStorage.getItem(USER_ID_STORAGE_KEY) ?? undefined;
  if (deviceId && userId) {
    return { deviceId, userId };
  }
}

export function getIDBFactory(): IDBFactory | undefined {
  return self?.indexedDB ? self.indexedDB : window.indexedDB;
}

export function saveUserDeviceToLocalStorage(userDevice: UserDevice) {
  logger.debug("Saving userDevice to localStorage", userDevice);
  if (localStorage) {
    localStorage.setItem(DEVICE_ID_STORAGE_KEY, userDevice.deviceId);
    localStorage.setItem(USER_ID_STORAGE_KEY, userDevice.userId);
  }
}

export async function clearAllStores() {
  logger.debug("Clearing all stores");
  clearDeviceFromLocalStorage();
  await clearMatrixIndexedDB();
}

function clearDeviceFromLocalStorage() {
  if (localStorage) {
    localStorage.removeItem(DEVICE_ID_STORAGE_KEY);
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }
}

async function clearMatrixIndexedDB(): Promise<void> {
  const matrixClient = createTemporaryMatrixClient("");
  await matrixClient.clearStores();
  matrixClient.stopClient();
}

export async function checkIfDatabaseExists(dbName: string) {
  const databases = await getIDBFactory()?.databases();
  return Boolean(databases?.some((db) => db.name === dbName));
}

export async function checkIfCryptoStoreDatabaseExists() {
  return (
    (await checkIfDatabaseExists("matrix-js-sdk::matrix-sdk-crypto")) &&
    isNonNullish(getUserDeviceFromLocalStorage()?.deviceId)
  );
}
