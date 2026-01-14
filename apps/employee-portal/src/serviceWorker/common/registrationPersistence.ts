/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getInspectionOfflineDb } from "@/serviceWorker/common/inspectionOfflineDb";

const REGISTRATION = "registration";
const SERVICE_WORKER = "service-worker";

export async function putServiceWorkerRegistration(scriptUrl?: string) {
  if (!scriptUrl) {
    return;
  }

  const db = await getInspectionOfflineDb();

  await db.put(REGISTRATION, { id: SERVICE_WORKER, registration: scriptUrl });
}

export async function getServiceWorkerRegistration() {
  const db = await getInspectionOfflineDb();

  return await db.get(REGISTRATION, SERVICE_WORKER);
}
