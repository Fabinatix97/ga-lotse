/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  GET_QUEUE,
  GET_QUEUE_EMPTY,
  GET_QUEUE_FAILED,
  GET_QUEUE_SOME,
  createQueueBroadCastChannelEndpoint,
} from "@/serviceWorker/common/queueBroadCastChannel";

export async function hasQueuedRequests() {
  return new Promise<boolean>((resolve, reject) => {
    const channel = createQueueBroadCastChannelEndpoint();
    channel.onmessage = (event: MessageEvent) => {
      if (event.data === GET_QUEUE_SOME) resolve(true);
      if (event.data === GET_QUEUE_EMPTY) resolve(false);
      if (event.data === GET_QUEUE_FAILED)
        reject(new Error("getQueuedRequests failed"));
      channel.close();
    };
    channel.postMessage(GET_QUEUE);
  });
}
