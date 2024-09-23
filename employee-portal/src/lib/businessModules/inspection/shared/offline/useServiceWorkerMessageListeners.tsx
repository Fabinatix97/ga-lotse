/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  DELETE_FILE_FAILED_WITH_404,
  REPLAY_DONE,
  REPLAY_FAILED,
  REPLAY_STARTED,
  createSyncBroadCastChannelEndpoint,
} from "@/serviceWorker/common/syncBroadCastChannel";

export function useServiceWorkerMessageListeners() {
  const { error, confirmation } = useSnackbar();
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  // Some Browsers fire sync events at a rate > 1Hz.
  // Thin out any error messages.
  const errorThrottled = useThrottle(error, 60_000);

  useEffect(() => {
    const syncChannel = createSyncBroadCastChannelEndpoint();

    syncChannel.onmessage = (event: MessageEvent) => {
      switch (event.data) {
        case REPLAY_STARTED:
          setSyncing(true);
          break;
        case REPLAY_FAILED:
          setSyncing(false);
          errorThrottled(
            "Serversynchronisation fehlgeschlagen (wird wiederholt)",
          );
          break;
        case REPLAY_DONE:
          setSyncing(false);
          confirmation("Daten mit Server synchronisiert");
          void queryClient.invalidateQueries();
          break;
        case DELETE_FILE_FAILED_WITH_404:
          error("Datei konnte nicht gelöscht werden (nicht gefunden)");
          break;
      }
    };

    return () => {
      syncChannel.close();
    };
  }, [confirmation, error, errorThrottled, queryClient]);

  return syncing;
}

function useThrottle<T>(callback: (arg: T) => void, timeoutMs: number) {
  const lastCall = useRef<number>();
  return useCallback(
    (arg: T) => {
      const now = Date.now();
      if (!lastCall.current || lastCall.current < now - timeoutMs) {
        callback(arg);
        lastCall.current = now;
      }
    },
    [callback, timeoutMs],
  );
}
