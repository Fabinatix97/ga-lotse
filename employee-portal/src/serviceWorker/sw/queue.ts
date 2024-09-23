/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Queue } from "workbox-background-sync";

import {
  CLEAR,
  CLEAR_DONE,
  CLEAR_FAILED,
  GET_QUEUE,
  GET_QUEUE_EMPTY,
  GET_QUEUE_FAILED,
  GET_QUEUE_SOME,
  SYNC,
  createQueueBroadCastChannelEndpoint,
} from "@/serviceWorker/common/queueBroadCastChannel";
import {
  DELETE_FILE_FAILED_WITH_404,
  REPLAY_DONE,
  REPLAY_FAILED,
  REPLAY_STARTED,
  createSyncBroadCastChannelEndpoint,
} from "@/serviceWorker/common/syncBroadCastChannel";
import {
  API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN,
  CACHE_RETENTION_IN_MINUTES,
} from "@/serviceWorker/sw/config";
import { decrypt, encrypt } from "@/serviceWorker/sw/crypto/crypto";

const queueChannel = createQueueBroadCastChannelEndpoint();
const syncChannel = createSyncBroadCastChannelEndpoint();

queueChannel.onmessage = (event: MessageEvent) => {
  if (event.data === CLEAR) {
    clearQueue().then(
      () => queueChannel.postMessage(CLEAR_DONE),
      (reason) => {
        queueChannel.postMessage(CLEAR_FAILED);
        throw reason;
      },
    );
  } else if (event.data === GET_QUEUE) {
    getQueuedRequests().then(
      (response) => queueChannel.postMessage(response),
      (reason) => {
        queueChannel.postMessage(GET_QUEUE_FAILED);
        throw reason;
      },
    );
  } else if (event.data === SYNC) {
    onSync({ queue }).catch((reason) => {
      throw reason;
    });
  }
};

async function onSync({ queue }: { queue: Queue }) {
  if (!(await queue.size())) return;
  let entry;
  let response;
  let errorMessage;
  syncChannel.postMessage(REPLAY_STARTED);
  while ((entry = await queue.shiftRequest())) {
    let request = entry.request.clone();
    await queue.unshiftRequest(entry);
    try {
      request = await decryptRequest(request);
      response = await fetch(request);
      if (!response?.ok) {
        errorMessage = handleHttpError(request, response);
      }
      await queue.shiftRequest();
    } catch (error) {
      errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : String(error);
    }
    if (errorMessage) {
      syncChannel.postMessage(REPLAY_FAILED);
      throw new Error(
        `queue ${queue.name} replay failed: ${String(errorMessage)}`,
      );
    }
  }

  syncChannel.postMessage(REPLAY_DONE);
}

const queue = new Queue("inspection-request-queue", {
  maxRetentionTime: CACHE_RETENTION_IN_MINUTES,
  onSync,
});

function handleHttpError(
  request: Request,
  response: Response,
): string | undefined {
  if (
    response.status === 404 &&
    request.method === "DELETE" &&
    API_INSPECTION_CHECKLISTS_FILE_PATH_PATTERN.test(
      new URL(request.url).pathname,
    )
  ) {
    // ignore 404 on delete file
    syncChannel.postMessage(DELETE_FILE_FAILED_WITH_404);
  } else {
    return response.statusText || `HTTP ${response.status}`;
  }
}

export async function pushRequestToQueue(request: Request): Promise<void> {
  const body = await encrypt(await request.clone().arrayBuffer());
  await queue.pushRequest({
    request: new Request(request, { body }),
  });
}

export async function pushEmptyRequestToQueue(request: Request): Promise<void> {
  await queue.pushRequest({
    request: new Request(request, { body: null }),
  });
}

async function clearQueue(): Promise<void> {
  while (await queue.popRequest()) {
    // placeholder comment
  }
}

async function getQueuedRequests(): Promise<string> {
  const size = await queue.size();
  return size ? GET_QUEUE_SOME : GET_QUEUE_EMPTY;
}

async function decryptRequest(request: Request): Promise<Request> {
  const buffer = await request.clone().arrayBuffer();
  const body = buffer.byteLength ? await decrypt(buffer) : null;
  return new Request(request, { body });
}
