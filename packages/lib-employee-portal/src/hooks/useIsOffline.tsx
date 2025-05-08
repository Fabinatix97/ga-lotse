/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from "react";

export function useIsOffline(): boolean {
  const isOnline = useSyncExternalStore(
    subscribeToStatusEvents,
    () => window.navigator.onLine,
    () => true,
  );

  return !isOnline;
}

function subscribeToStatusEvents(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}
