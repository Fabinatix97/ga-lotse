/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixClient, createClient } from "matrix-js-sdk";
import { isStrictEqual } from "remeda";

import {
  clearAllStores,
  getUserDeviceFromLocalStorage,
  saveUserDeviceToLocalStorage,
} from "@/lib/businessModules/chat/matrix/tokens";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { UserDevice } from "@/lib/businessModules/chat/shared/types";

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

export async function clearAllStoresOnUserChange(selfUserChatUserId?: string) {
  const userDevice: UserDevice | undefined = getUserDeviceFromLocalStorage();
  logger.info(
    `Validating cached userDevice: ${userDevice?.deviceId} userId: ${userDevice?.userId} for selfUserChatUserId: ${selfUserChatUserId}`,
  );
  if (
    !userDevice ||
    !deviceBelongsToLoggedInUser(userDevice, selfUserChatUserId)
  ) {
    await clearAllStores();
  }
}

export async function loginWithCachedDeviceOrWithNewDevice(
  baseUrl: string,
  selfUserChatUserId?: string,
) {
  let userDevice: UserDevice | undefined = getUserDeviceFromLocalStorage();

  if (
    userDevice &&
    deviceBelongsToLoggedInUser(userDevice, selfUserChatUserId)
  ) {
    userDevice = await loginWithDevice(baseUrl, userDevice.deviceId);
  } else {
    await clearAllStores();
    userDevice = await loginWithNewDevice(baseUrl);

    saveUserDeviceToLocalStorage(userDevice);
  }
  logger.info("Logged into userDevice", userDevice);
  return userDevice;
}

function deviceBelongsToLoggedInUser(
  userDevice?: UserDevice,
  selfUserChatUserId?: string,
) {
  if (!userDevice) {
    logger.debug("UserDevice info not found in local storage");
    return false;
  }

  if (!userDevice.deviceId || !userDevice.userId) {
    logger.debug("Missing deviceId or userId in local storage");
    return false;
  }

  if (!isStrictEqual(selfUserChatUserId, userDevice.userId)) {
    logger.debug(
      "Device userId: " +
        userDevice.userId +
        " is not matching logged-in user: " +
        selfUserChatUserId,
    );
    return false;
  }
  return true;
}

async function loginWithDevice(baseUrl: string, deviceId: string) {
  logger.info("Login to synapse with deviceId:", deviceId);
  const matrixClient = createTemporaryMatrixClient(baseUrl, deviceId);
  return await requestUserDeviceInfo(matrixClient);
}

export async function loginWithNewDevice(baseUrl: string) {
  logger.info("Login to synapse with new deviceId.");
  const matrixClient = createTemporaryMatrixClient(baseUrl);
  return await requestUserDeviceInfo(matrixClient);
}

async function requestUserDeviceInfo(
  matrixClient: MatrixClient,
): Promise<UserDevice> {
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
