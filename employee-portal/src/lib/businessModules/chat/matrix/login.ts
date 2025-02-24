/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, createClient } from "matrix-js-sdk";
import { isStrictEqual } from "remeda";

import {
  clearCachedCredentials,
  clearMatrixStores,
  getCachedCredentials,
  persistCredentials,
} from "@/lib/businessModules/chat/matrix/tokens";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export function fetchFn(
  input: RequestInfo | URL,
  init?: RequestInit,
  deviceId?: string,
): Promise<Response> {
  const headers = deviceId
    ? {
        ...init?.headers,
        "X-Forwarded-Matrix-Device-Id": deviceId,
      }
    : init?.headers;

  return fetch(input, {
    ...init,
    credentials: "same-origin",
    headers,
  });
}

export async function getCredentials(
  baseUrl: string,
  selfUserChatUserId?: string,
) {
  let credentials = getCachedCredentials();

  if (
    !hasValidCachedCredentials(
      credentials.userId,
      credentials.deviceId,
      selfUserChatUserId,
    )
  ) {
    logger.debug("Clear cache and Login to synapse and get new deviceId");
    const temporaryMatrixClient = createTemporaryMatrixClient(baseUrl);
    await clearMatrixStores();
    clearCachedCredentials();
    credentials = await requestCredentials(temporaryMatrixClient);
    persistCredentials(credentials);
  } else {
    logger.debug("Login to synapse with cached deviceId");
    const temporaryMatrixClient = createTemporaryMatrixClient(
      baseUrl,
      credentials.deviceId,
    );
    await requestCredentials(temporaryMatrixClient);
  }

  return credentials;
}

export async function validateCachedCredentials(
  selfUserChatUserId?: string,
  initialValidation = false,
) {
  logger.debug("Validate cached credentials", selfUserChatUserId);
  const credentials = getCachedCredentials();

  if (initialValidation && !credentials.deviceId && !credentials.userId) return;

  if (
    !hasValidCachedCredentials(
      credentials.userId,
      credentials.deviceId,
      selfUserChatUserId,
    )
  ) {
    await clearMatrixStores();
    clearCachedCredentials();
  }
}

function hasValidCachedCredentials(
  userId?: string,
  deviceId?: string,
  selfUserChatUserId?: string,
) {
  if (!deviceId || !userId) {
    logger.debug("deviceId or userId not found in cache");
    return false;
  }

  if (!isStrictEqual(selfUserChatUserId, userId)) {
    logger.debug("Cached userId is not matching logged-in user.");
    return false;
  }
  return true;
}

export async function requestCredentials(matrixClient: MatrixClient) {
  logger.debug("Requesting userId and deviceid from matrix whoami endpoint");

  try {
    const whoamiResponse = await matrixClient.whoami();
    if (!whoamiResponse.device_id || !whoamiResponse.user_id) {
      throw new Error("Unable to retrieve whoami data");
    }
    return {
      userId: whoamiResponse.user_id,
      deviceId: whoamiResponse.device_id,
    };
  } catch (error) {
    logger.softError("Unable to get client credentials");
    throw error;
  }
}

export function createTemporaryMatrixClient(
  baseUrl: string,
  deviceId?: string,
) {
  return createClient({
    baseUrl: baseUrl,
    fetchFn: (input, init) => fetchFn(input, init, deviceId),
  });
}
