/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DBSchema, IDBPDatabase, openDB } from "idb";

const DB_NAME = "inspection-offline";
export const DESIRED_INSPECTION_IDS = "desired-inspection-ids";
export const SALT = "salt";
export const REGISTRATION = "registration";
export type State = "fetching" | "deleting" | "success";

interface InspectionRecord {
  id: string;
  state: State;
}

interface SaltRecord {
  id: string;
  salt: ArrayBufferLike;
}

interface RegistrationRecord {
  id: string;
  registration: string;
}

interface InspectionDB extends DBSchema {
  [DESIRED_INSPECTION_IDS]: {
    key: string;
    value: InspectionRecord;
  };
  [SALT]: {
    key: string;
    value: SaltRecord;
  };
  [REGISTRATION]: {
    key: string;
    value: RegistrationRecord;
  };
}

export function getInspectionOfflineDb(): Promise<IDBPDatabase<InspectionDB>> {
  return openDB<InspectionDB>(DB_NAME, 3, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DESIRED_INSPECTION_IDS)) {
        db.createObjectStore(DESIRED_INSPECTION_IDS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(SALT)) {
        db.createObjectStore(SALT, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(REGISTRATION)) {
        db.createObjectStore(REGISTRATION, { keyPath: "id" });
      }
    },
  });
}
