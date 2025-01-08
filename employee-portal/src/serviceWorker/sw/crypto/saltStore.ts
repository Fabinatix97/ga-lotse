/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SALT,
  getInspectionOfflineDb,
} from "@/serviceWorker/common/inspectionOfflineDb";
import { getGlobalSelf } from "@/serviceWorker/sw/util";

const OFFLINE_PASSWORD_SALT = "offline-password-salt";

export async function createSalt(): Promise<ArrayBufferLike> {
  const db = await getInspectionOfflineDb();

  const salt = getGlobalSelf().crypto.getRandomValues(new Uint8Array(16));
  await db.put(SALT, { id: OFFLINE_PASSWORD_SALT, salt: salt.buffer });
  return Promise.resolve(salt.buffer);
}

export async function restoreSalt(): Promise<ArrayBufferLike> {
  const db = await getInspectionOfflineDb();

  const salt = await db.get(SALT, OFFLINE_PASSWORD_SALT);
  if (!salt) {
    throw new Error("Salt lost");
  }
  return salt.salt;
}
