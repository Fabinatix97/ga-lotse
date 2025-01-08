/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CryptoEvent } from "matrix-js-sdk";
import { BackupTrustInfo, KeyBackupInfo } from "matrix-js-sdk/lib/crypto-api";
import { useCallback, useEffect, useState } from "react";

import { getBackupKeyStatus } from "@/lib/businessModules/chat/matrix/crypto";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";

type BKStatus = Awaited<ReturnType<typeof getBackupKeyStatus>>;

type BackupStatus = Partial<
  {
    backupInfo: KeyBackupInfo | null;
    backupTrustInfo: BackupTrustInfo;
    activeBackupVersion: string | null;
    sessionsRemaining: number;
  } & BKStatus
>;

export function useBackupInfo() {
  const { clientState, matrixClient } = useChatClientContext();
  const [backupStatus, setBackupStatus] = useState<BackupStatus>();

  const updateState = useCallback((data: BackupStatus) => {
    return setBackupStatus((prev) => ({ ...prev, ...data }));
  }, []);

  const loadBackupStatus = useCallback(async () => {
    const backupKeyStatus = await getBackupKeyStatus(matrixClient);
    try {
      const backupInfo = await matrixClient.getKeyBackupVersion();
      const backupTrustInfo = backupInfo
        ? await matrixClient.getCrypto()?.isKeyBackupTrusted(backupInfo)
        : undefined;

      const activeBackupVersion =
        (await matrixClient.getCrypto()?.getActiveSessionBackupVersion()) ??
        null;

      updateState({
        backupInfo,
        backupTrustInfo,
        activeBackupVersion,
        ...backupKeyStatus,
      });
    } catch {
      updateState({
        backupInfo: null,
        backupTrustInfo: undefined,
        activeBackupVersion: null,
      });
    }
  }, [matrixClient, updateState]);

  const onKeyBackupSessionsRemaining = useCallback(
    (sessionsRemaining: number) => {
      updateState({ sessionsRemaining });
    },
    [updateState],
  );

  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;

    void loadBackupStatus();

    matrixClient.on(CryptoEvent.KeyBackupStatus, () => {
      void loadBackupStatus();
    });
    matrixClient.on(
      CryptoEvent.KeyBackupSessionsRemaining,
      onKeyBackupSessionsRemaining,
    );

    return () => {
      matrixClient.off(CryptoEvent.KeyBackupStatus, () => {
        void loadBackupStatus();
      });
      matrixClient.off(
        CryptoEvent.KeyBackupSessionsRemaining,
        onKeyBackupSessionsRemaining,
      );
    };
  }, [
    clientState,
    loadBackupStatus,
    matrixClient,
    onKeyBackupSessionsRemaining,
    updateState,
  ]);

  return { backupStatus, loadBackupStatus };
}
