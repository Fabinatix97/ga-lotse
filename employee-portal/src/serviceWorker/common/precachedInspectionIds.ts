/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DESIRED_INSPECTION_IDS,
  State,
  getInspectionOfflineDb,
} from "@/serviceWorker/common/inspectionOfflineDb";
import {
  createInspectionChangedMessage,
  createPrecachedInspectionIdsBroadCastChannelEndpoint,
} from "@/serviceWorker/common/precachedInspectionIdsBroadCastChannel";

interface PrecachedInspectionIds {
  add(id: string, state: State): Promise<void>;
  updateState(id: string, state: State): Promise<boolean>;
  delete(id: string): Promise<boolean>;
  clean(): Promise<void>;
  clear(): Promise<void>;
  has(id: string): Promise<boolean>;
  get(id: string): Promise<State | undefined>;
  size(): Promise<number>;
  getSuccessful(): Promise<string[]>;
  getAll(): Promise<string[]>;
}

const precachedInspectionIdsChannel =
  createPrecachedInspectionIdsBroadCastChannelEndpoint();

function notifyInspectionChange(id: string) {
  precachedInspectionIdsChannel.postMessage(createInspectionChangedMessage(id));
}

export const precachedInspectionIds: PrecachedInspectionIds = {
  async add(id: string, state: State) {
    const db = await getInspectionOfflineDb();
    await db.put(DESIRED_INSPECTION_IDS, { id, state });
    notifyInspectionChange(id);
  },

  async updateState(id: string, state: State): Promise<boolean> {
    const db = await getInspectionOfflineDb();
    const record = await db.get(DESIRED_INSPECTION_IDS, id);

    if (record) {
      record.state = state;
      await db.put(DESIRED_INSPECTION_IDS, record);
      notifyInspectionChange(id);
      return true;
    } else {
      return false;
    }
  },

  async delete(id: string): Promise<boolean> {
    const db = await getInspectionOfflineDb();
    const record = await db.get(DESIRED_INSPECTION_IDS, id);

    if (record) {
      await db.delete(DESIRED_INSPECTION_IDS, id);
      notifyInspectionChange(id);
      return true;
    } else {
      return false;
    }
  },

  async clean() {
    const db = await getInspectionOfflineDb();
    const allRecords = await db.getAll(DESIRED_INSPECTION_IDS);
    return (
      Promise.all(
        allRecords
          .filter((record) => ["fetching", "deleting"].includes(record.state))
          .map(async (record) => {
            await db.delete(DESIRED_INSPECTION_IDS, record.id);
            notifyInspectionChange(record.id);
          }),
      )
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .then(() => {})
    );
  },

  async clear() {
    const db = await getInspectionOfflineDb();
    const allRecords = await db.getAll(DESIRED_INSPECTION_IDS);
    await db.clear(DESIRED_INSPECTION_IDS);
    allRecords.map((record) => {
      notifyInspectionChange(record.id);
    });
  },

  async has(id: string): Promise<boolean> {
    const db = await getInspectionOfflineDb();
    const record = await db.get(DESIRED_INSPECTION_IDS, id);
    return (["success", "fetching"] as (string | undefined)[]).includes(
      record?.state,
    );
  },

  async get(id: string): Promise<State | undefined> {
    const db = await getInspectionOfflineDb();
    const record = await db.get(DESIRED_INSPECTION_IDS, id);
    return record?.state;
  },

  async size(): Promise<number> {
    const db = await getInspectionOfflineDb();
    const allRecords = await db.getAll(DESIRED_INSPECTION_IDS);
    return allRecords.filter((record) =>
      ["success", "fetching"].includes(record.state),
    ).length;
  },

  async getSuccessful(): Promise<string[]> {
    const db = await getInspectionOfflineDb();
    const allRecords = await db.getAll(DESIRED_INSPECTION_IDS);
    return allRecords
      .filter((record) => record.state === "success")
      .map((record) => record.id);
  },

  async getAll(): Promise<string[]> {
    const db = await getInspectionOfflineDb();
    const allRecords = await db.getAll(DESIRED_INSPECTION_IDS);
    return allRecords.map((record) => record.id);
  },
};
