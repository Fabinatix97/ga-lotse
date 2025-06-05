/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueryClient } from "@tanstack/react-query";
import { MatrixClient } from "matrix-js-sdk";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigation } from "@eshg/lib-portal";

import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import {
  extractUrl,
  setPresenceOffline,
} from "@/lib/businessModules/chat/shared/utils";

export const CHAT_TIMEOUT_MS = 10 * 60 * 1000;
export const CHAT_TIMEOUT_COUNTDOWN = 9 * 60 * 1000;
const API_CHAT_SYNC_PATH_PATTERN = new RegExp(
  "^/?.*api/synapse/_matrix/client/v3/sync(\\?.*)?$",
);

export function useChatActivityTimeout(
  matrixClient: MutableRefObject<MatrixClient>,
  setClientState: Dispatch<SetStateAction<ClientState>>,
  clientState: ClientState,
) {
  const queryClient = useQueryClient();
  const [timestamp, setTimestamp] = useState(Date.now());
  const [countdown, setCountdown] = useState<number | null>(null);
  const { tryNavigate } = useNavigation();

  const goOffline = useCallback(() => {
    void setPresenceOffline(matrixClient.current).then(() => {
      setClientState(ClientState.Idle);
    });
  }, [matrixClient, setClientState]);

  const goOnline = useCallback(() => {
    if (clientState !== ClientState.Idle) return;
    setClientState(ClientState.Restart);
  }, [clientState, setClientState]);

  const monitorChatActivity = useCallback((input?: RequestInfo | URL) => {
    const currentTimestamp = Date.now();
    const url = extractUrl(input);
    const isSyncCall = Boolean(url && API_CHAT_SYNC_PATH_PATTERN.test(url));
    if (!isSyncCall) {
      setTimestamp(currentTimestamp);
    }
  }, []);

  const refreshChatActivity = useCallback(async () => {
    try {
      await matrixClient.current.whoami();
      goOnline();
      setCountdown(null);
    } catch (err) {
      logger.error(err);
      tryNavigate(routes.index);
    }
  }, [goOnline, matrixClient, tryNavigate]);

  useEffect(() => {
    let interval: number | null = null;
    let countdownInterval: number | null = null;
    if (clientState !== ClientState.Idle) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const inactiveFor = now - timestamp;
        if (inactiveFor >= CHAT_TIMEOUT_COUNTDOWN && !countdownInterval) {
          startCountdown();
        }
      }, 10000);
      function startCountdown() {
        countdownInterval = window.setInterval(() => {
          const now = Date.now();
          const inactiveFor = now - timestamp;
          const remainingMs = Math.max(0, CHAT_TIMEOUT_MS - inactiveFor);
          const remainingSeconds = Math.ceil(remainingMs / 1000);
          if (remainingSeconds <= 1) {
            goOffline();
            setCountdown(null);
          } else {
            setCountdown(remainingSeconds);
          }
        }, 1000);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
        setCountdown(null);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [clientState, goOffline, timestamp]);

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(({ type }) => {
      if (type === "added" || type === "updated") {
        monitorChatActivity();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [monitorChatActivity, queryClient]);

  return {
    monitorChatActivity,
    refreshChatActivity,
    countdown,
  };
}
