/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  API_CACHE_NAME,
  PAGES_CACHE_NAME,
  PAGES_RSC_CACHE_NAME,
  X_ESHG_INSPECTION_ID,
} from "@/serviceWorker/common/common";
import {
  CLEAR,
  CLEAR_DONE,
  CLEAR_FAILED,
  createQueueBroadCastChannelEndpoint,
} from "@/serviceWorker/common/queueBroadCastChannel";

export async function clearQueue() {
  return new Promise<void>((resolve, reject) => {
    const queueChannel = createQueueBroadCastChannelEndpoint();
    queueChannel.onmessage = (event: MessageEvent) => {
      if (event.data === CLEAR_DONE) {
        resolve();
        queueChannel.close();
      }
      if (event.data === CLEAR_FAILED) {
        reject(new Error("queue clear failed"));
        queueChannel.close();
      }
    };
    queueChannel.onmessageerror = (event: MessageEvent) => {
      // eslint-disable-next-line no-console
      console.error("queue channel: error for message CLEAR", event);
    };
    queueChannel.postMessage(CLEAR);
  });
}

export async function clearCaches() {
  await caches.delete(PAGES_CACHE_NAME);
  await caches.delete(PAGES_RSC_CACHE_NAME);
  await caches.delete(API_CACHE_NAME);
}

export async function deleteInspectionFromAllCaches(inspectionId: string) {
  await deleteFromCache(await caches.open(PAGES_CACHE_NAME), inspectionId);
  await deleteFromCache(await caches.open(PAGES_RSC_CACHE_NAME), inspectionId);
  await deleteFromCache(await caches.open(API_CACHE_NAME), inspectionId);
}

async function deleteFromCache(cache: Cache, inspectionId?: string) {
  const lowerCaseInspectionId = inspectionId?.toLowerCase();
  await Promise.all(
    (await cache.keys())
      .filter(
        (r) =>
          lowerCaseInspectionId == null ||
          r.headers.get(X_ESHG_INSPECTION_ID)?.toLowerCase() ===
            lowerCaseInspectionId,
      )
      .map((r) => cache.delete(r)),
  );
}
