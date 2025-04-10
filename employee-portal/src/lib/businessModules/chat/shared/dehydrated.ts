/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient } from "matrix-js-sdk";
import { CryptoApi } from "matrix-js-sdk/lib/crypto-api";

import { getCryptoApi } from "@/lib/businessModules/chat/matrix/crypto";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { delayed } from "@/lib/businessModules/chat/shared/utils";

/**
 * If dehydration is enabled (i.e., it is supported by the server and enabled in
 * the configuration), rehydrate a device (if available) and create
 * a new dehydrated device.
 *
 * @param createNewKey: force a new dehydration key to be created, even if one
 *   already exists.  This is used when we reset secret storage.
 */
export async function startDehydration(
  matrixClient: MatrixClient,
  createNewKey = false,
): Promise<void> {
  const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
  // add loop that checks if secretStorage is set up
  while (true) {
    await delayed(() => null, 500);
    const secretStorageReady = await cryptoApi.isSecretStorageReady();
    const backupInfo = await matrixClient.getKeyBackupVersion();
    const backupTrustInfo = backupInfo
      ? await matrixClient.getCrypto()?.isKeyBackupTrusted(backupInfo)
      : undefined;

    logger.info("dehydratedDevices", {
      secretStorageReady,
      trusted: backupTrustInfo?.trusted,
    });
    if (secretStorageReady && backupTrustInfo?.trusted) {
      await initialiseDehydration(cryptoApi, createNewKey);
      break;
    }
  }
}

async function initialiseDehydration(
  crypto: CryptoApi,
  createNewKey = false,
): Promise<void> {
  if (!crypto) return;
  if (await crypto.isDehydrationSupported()) {
    logger.info("Device dehydration enabled");
    await crypto.startDehydration(createNewKey);
  }
}
