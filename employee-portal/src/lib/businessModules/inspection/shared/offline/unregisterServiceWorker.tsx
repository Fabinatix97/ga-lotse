/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  UNREGISTER,
  createUnregisterBroadCastChannelEndpoint,
} from "@/serviceWorker/common/unregisterBroadCastChannel";

const unregisterChannel = createUnregisterBroadCastChannelEndpoint();

export function unregisterServiceWorker() {
  unregisterChannel.postMessage(UNREGISTER);
}
