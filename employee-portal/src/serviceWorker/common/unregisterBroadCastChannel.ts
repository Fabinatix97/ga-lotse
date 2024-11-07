/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function createUnregisterBroadCastChannelEndpoint() {
  return new BroadcastChannel("service-worker-unregister");
}

export const UNREGISTER = "unregister";
