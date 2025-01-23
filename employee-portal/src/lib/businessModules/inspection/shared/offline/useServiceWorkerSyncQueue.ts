/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";
import {
  DELETE_FILE_FAILED_WITH_404,
  REPLAY_ABORTED,
  REPLAY_DONE,
  REPLAY_FAILED,
  REPLAY_FAILED_WITH_401,
  REPLAY_STARTED,
  SYNC,
  createQueueBroadCastChannelEndpoint,
} from "@/serviceWorker/common/queueBroadCastChannel";

const queueChannel = createQueueBroadCastChannelEndpoint();

export function useServiceWorkerSyncQueue() {
  const queryClient = useQueryClient();
  const snackbar = useSnackbar();
  const [syncing, setSyncing] = useState(false);
  const offline = useIsOffline();

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      switch (event.data) {
        case REPLAY_STARTED:
          setSyncing(true);
          break;
        case REPLAY_FAILED:
          setSyncing(false);
          snackbar.error(
            "Serversynchronisation fehlgeschlagen (wird wiederholt)",
          );
          triggerSync(offline);
          break;
        case REPLAY_ABORTED:
          setSyncing(false);
          snackbar.error("Serversynchronisation fehlgeschlagen");
          break;
        case REPLAY_DONE:
          setSyncing(false);
          void queryClient.invalidateQueries();
          snackbar.confirmation("Daten mit Server synchronisiert");
          break;
        case REPLAY_FAILED_WITH_401:
          // Use browser reload to trigger redirect to Keycloak
          window.location.reload();
          break;
        case DELETE_FILE_FAILED_WITH_404:
          snackbar.error("Datei konnte nicht gelöscht werden (nicht gefunden)");
          break;
      }
    }

    queueChannel.addEventListener("message", handleMessage);
    return () => {
      queueChannel.removeEventListener("message", handleMessage);
    };
  }, [offline, snackbar, queryClient]);

  useEffect(() => {
    triggerSync(offline);
  }, [offline]);

  return syncing;
}

function triggerSync(offline: boolean) {
  if (!offline) {
    queueChannel.postMessage(SYNC);
  }
}
