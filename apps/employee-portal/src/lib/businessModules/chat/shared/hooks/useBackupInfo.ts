/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BackupTrustInfo,
  CryptoApi,
  CryptoEvent,
  KeyBackupInfo,
} from "matrix-js-sdk/lib/crypto-api";
import { useCallback, useEffect, useState } from "react";

import {
  getBackupKeyStatus,
  getCryptoApi,
} from "@/lib/businessModules/chat/matrix/crypto";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

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
  const { matrixClient, isClientPrepared } = useChatClientContext();
  const [backupStatus, setBackupStatus] = useState<BackupStatus>();

  const updateState = useCallback((data: BackupStatus) => {
    return setBackupStatus((prev) => ({ ...prev, ...data }));
  }, []);

  const loadBackupStatus = useCallback(async () => {
    const backupKeyStatus = await getBackupKeyStatus(matrixClient);
    try {
      const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
      const backupInfo = await cryptoApi.getKeyBackupInfo();
      const backupTrustInfo = backupInfo
        ? await cryptoApi.isKeyBackupTrusted(backupInfo)
        : undefined;

      const activeBackupVersion =
        (await cryptoApi.getActiveSessionBackupVersion()) ?? null;

      updateState({
        backupInfo,
        backupTrustInfo,
        activeBackupVersion,
        ...backupKeyStatus,
      });
    } catch (error) {
      updateState({
        backupInfo: null,
        backupTrustInfo: undefined,
        activeBackupVersion: null,
      });
      logger.error(error);
    }
  }, [matrixClient, updateState]);

  const onKeyBackupSessionsRemaining = useCallback(
    (sessionsRemaining: number) => {
      updateState({ sessionsRemaining });
    },
    [updateState],
  );

  useEffect(() => {
    if (!isClientPrepared) return;

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
    isClientPrepared,
    loadBackupStatus,
    matrixClient,
    onKeyBackupSessionsRemaining,
    updateState,
  ]);

  return { backupStatus, loadBackupStatus };
}
