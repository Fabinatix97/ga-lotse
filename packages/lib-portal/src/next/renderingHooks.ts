/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from "react";
import { doNothing } from "remeda";

// inspired by https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-use-sync-external-store#usesyncexternalstore

/**
 * Returns true only when running on the client without causing hydration mismatches
 */
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client-side state
    () => false, // server-side state
  );
}

/**
 * Returns true only when running on the server without causing hydration mismatches
 */
export function useIsServer() {
  const isClient = useIsClient();
  return !isClient;
}

function emptySubscribe() {
  return doNothing;
}
