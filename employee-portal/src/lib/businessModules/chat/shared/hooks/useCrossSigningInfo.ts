/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-misused-promises */
import { ClientEvent, CryptoEvent, MatrixEvent } from "matrix-js-sdk";
import { useCallback, useEffect, useState } from "react";

import { getCrossSigningStatus } from "@/lib/businessModules/chat/matrix/crypto";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";

type RTCrossSigningStatus = Awaited<ReturnType<typeof getCrossSigningStatus>>;
type CsStatus = Partial<RTCrossSigningStatus>;

export function useCrossSigningInfo() {
  const { clientState, matrixClient } = useChatClientContext();
  const [crossSigningStatus, setCrossSigningStatus] = useState<CsStatus>();

  const getUpdatedStatus = useCallback(async () => {
    const status = await getCrossSigningStatus(matrixClient);
    setCrossSigningStatus((prev) => ({ ...prev, ...status }));
  }, [matrixClient]);

  const onAccountData = useCallback(
    async (event: MatrixEvent) => {
      const type = event.getType();
      if (
        type.startsWith("m.cross_signing") ||
        type.startsWith("m.secret_storage")
      ) {
        await getUpdatedStatus();
      }
    },
    [getUpdatedStatus],
  );

  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;

    matrixClient.on(ClientEvent.AccountData, onAccountData);
    matrixClient.on(CryptoEvent.UserTrustStatusChanged, getUpdatedStatus);
    matrixClient.on(CryptoEvent.KeysChanged, getUpdatedStatus);
    void getUpdatedStatus();

    return () => {
      matrixClient.off(ClientEvent.AccountData, onAccountData);
      matrixClient.off(CryptoEvent.UserTrustStatusChanged, getUpdatedStatus);
      matrixClient.off(CryptoEvent.KeysChanged, getUpdatedStatus);
    };
  }, [clientState, getUpdatedStatus, matrixClient, onAccountData]);

  return { crossSigningStatus, loadCrossSigningStatus: getUpdatedStatus };
}
