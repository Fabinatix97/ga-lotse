/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from "react";

import { useIsOfflineFeatureEnabled } from "@/lib/businessModules/inspection/shared/offline/useIsOfflineFeatureEnabled";

export function useIsOffline() {
  const isOfflineEnabled = useIsOfflineFeatureEnabled();

  const isOnline = useSyncExternalStore(
    subscribe,
    () => window.navigator.onLine,
    () => true,
  );

  // if the OFFLINE feature toggle is disabled, then ignore the online/offline detection
  if (!isOfflineEnabled) {
    return false;
  }

  return !isOnline;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}
