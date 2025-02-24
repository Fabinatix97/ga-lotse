/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient } from "matrix-js-sdk";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { IIdleTimerProps, useIdleTimer } from "react-idle-timer";

import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { setPresenceOffline } from "@/lib/businessModules/chat/shared/utils";

export function useIdleTimerHook(
  matrixClient: MutableRefObject<MatrixClient>,
  setClientState: Dispatch<SetStateAction<ClientState>>,
  idleTimerProps?: IIdleTimerProps,
) {
  useIdleTimer({
    onIdle() {
      logger.info("Chat onIdle");
      void setPresenceOffline(matrixClient.current).then(() => {
        matrixClient.current.stopClient();
      });
    },
    onActive() {
      logger.info("Chat onActive");
      setClientState(ClientState.Restart);
    },
    timeout: 300000,
    ...idleTimerProps,
  });
}
