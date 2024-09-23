/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */

/**
 * Retrieves the IndexedDB factory object.
 */
export function getIDBFactory(): IDBFactory | undefined {
  return self?.indexedDB ? self.indexedDB : window.indexedDB;
}

let idb: IDBDatabase | null = null;
const dbName = "matrix-react-sdk";

/**
 * Loads an item from an IndexedDB table within the underlying `matrix-react-sdk` database.
 *
 * If IndexedDB access is not supported in the environment, an error is thrown.
 */
async function idbInit(): Promise<void> {
  if (!getIDBFactory()) {
    throw new Error("IndexedDB not available");
  }
  idb = await new Promise((resolve, reject) => {
    const request = getIDBFactory()!.open(dbName, 1);
    request.onerror = (): void => {
      reject(request.error);
    };
    request.onsuccess = (): void => {
      resolve(request.result);
    };
    request.onupgradeneeded = (): void => {
      const db = request.result;
      db.createObjectStore("pickleKey");
      db.createObjectStore("account");
    };
  });
}

/**
 * Saves data to an IndexedDB table within the underlying `matrix-react-sdk` database.
 *
 * If IndexedDB access is not supported in the environment, an error is thrown.
 */
export async function idbLoad(
  table: string,
  key: string | string[],
): Promise<any> {
  if (!idb) {
    await idbInit();
  }
  return new Promise((resolve, reject) => {
    const txn = idb!.transaction([table], "readonly");
    txn.onerror = reject;

    const objectStore = txn.objectStore(table);
    const request = objectStore.get(key);
    request.onerror = (): void => {
      reject(request.error);
    };
    request.onsuccess = (): void => {
      resolve(request.result);
    };
  });
}

/**
 * Saves data to an IndexedDB table within the underlying `matrix-react-sdk` database.
 *
 * If IndexedDB access is not supported in the environment, an error is thrown.
 */
export async function idbSave(
  table: string,
  key: string | string[],
  data: any,
): Promise<void> {
  if (!idb) {
    await idbInit();
  }
  return new Promise((resolve, reject) => {
    const txn = idb!.transaction([table], "readwrite");
    txn.onerror = reject;

    const objectStore = txn.objectStore(table);
    const request = objectStore.put(data, key);
    request.onerror = (): void => {
      reject(request.error);
    };
    request.onsuccess = (): void => {
      resolve();
    };
  });
}

/**
 * Deletes a record from an IndexedDB table within the underlying `matrix-react-sdk` database.
 *
 * If IndexedDB access is not supported in the environment, an error is thrown.
 */
export async function idbDelete(
  table: string,
  key: string | string[],
): Promise<void> {
  if (!idb) {
    await idbInit();
  }
  return new Promise((resolve, reject) => {
    const txn = idb!.transaction([table], "readwrite");
    txn.onerror = reject;

    const objectStore = txn.objectStore(table);
    const request = objectStore.delete(key);
    request.onerror = (): void => {
      reject(request.error);
    };
    request.onsuccess = (): void => {
      resolve();
    };
  });
}

/**
 * Clear all records from an IndexedDB table within the underlying `matrix-react-sdk` database.
 *
 * If IndexedDB access is not supported in the environment, an error is thrown.
 */
export async function idbClearTable(table: string): Promise<void> {
  if (!idb) {
    await idbInit();
  }
  return new Promise((resolve, reject) => {
    const txn = idb!.transaction([table], "readwrite");
    txn.onerror = reject;

    const objectStore = txn.objectStore(table);
    const request = objectStore.clear();
    request.onerror = (): void => {
      reject(request.error);
    };
    request.onsuccess = (): void => {
      resolve();
    };
  });
}

export async function idbDeleteDb(): Promise<void> {
  if (!getIDBFactory()) {
    throw new Error("IndexedDB not available");
  }

  return new Promise((resolve, reject) => {
    if (idb) {
      idb.close();
    }
    const request = getIDBFactory()!.deleteDatabase(dbName);
    request.onerror = (): void => {
      reject(request.error);
    };
    request.onsuccess = (): void => {
      idb = null;
      resolve();
    };
    request.onblocked = (): void => {
      reject(request.error);
    };
  });
}
