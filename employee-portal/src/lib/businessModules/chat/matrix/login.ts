/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUser } from "@eshg/employee-portal-api/base";
import {
  MatrixClient,
  SSOAction,
  createClient,
} from "matrix-js-sdk/lib/matrix";

import {
  createPickleKey,
  getPickleKey,
} from "@/lib/businessModules/chat/matrix/pickling";
import {
  clearCachedCredentials,
  deleteCachedCredentials,
  getCachedCredentials,
  persistCredentials,
} from "@/lib/businessModules/chat/matrix/tokens";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export interface ILoginParams {
  baseUrl: string;
  selfUser: ApiUser;
}

async function healthcheckHomeserver(matrixClient: MatrixClient) {
  try {
    const response = await fetch(
      `${matrixClient.getHomeserverUrl()}/_matrix/client/versions`,
    );
    if (!response.ok) {
      throw new Error("Synapse is unavailable");
    }
    return true;
  } catch (error) {
    logger.error("Synapse health check failed:", error);
    return false;
  }
}

function startSingleSignOn(
  matrixClient: MatrixClient,
  loginType: "sso" | "cas" = "sso",
  idpId?: string,
  action?: SSOAction,
) {
  const callbackUrl = new URL(window.location.href).toString();

  window.location.href = matrixClient.getSsoLoginUrl(
    callbackUrl,
    loginType,
    idpId,
    action,
  );
}

function extractLoginToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("loginToken");
}

async function handleSSOLogin(matrixClient: MatrixClient) {
  logger.debug("Start SSO login");
  const loginToken = extractLoginToken();

  // if token not found, start SSO flow
  if (!loginToken) {
    const serverHealthy = await healthcheckHomeserver(matrixClient);
    if (serverHealthy) {
      void startSingleSignOn(matrixClient);
    }

    // Return undefined to stop login process
    return undefined;
  }

  return matrixClient.loginWithToken(loginToken);
}

function verifyCachedUserId(chatUsername?: string, userId?: string) {
  return userId?.toLowerCase() === chatUsername?.toLowerCase();
}

async function createLoggedInClient(payload: ILoginParams) {
  // Create guest client
  const matrixClient = createClient({
    baseUrl: payload.baseUrl,
  });

  // Clear stores
  await clearCachedCredentials();
  await matrixClient.clearStores();

  // Start SSO, redirect the page to receive the login token.
  // Once the token is received in the search parameters, we can initiate the login process.
  // desc: https://spec.matrix.org/v1.11/client-server-api/#client-login-via-sso
  const response = await handleSSOLogin(matrixClient);

  // If response is undefined that means the SSO process is ongoing.
  // Return `undefined` here and await redirection with the login token,
  // otherwise, a guest client will be returned.
  if (!response) return undefined;

  return matrixClient;
}

async function createCachedClient(payload: ILoginParams) {
  const { accessToken, deviceId, userId } = await getCachedCredentials();

  const isMatchedUser = verifyCachedUserId(
    payload.selfUser.externalChatUsername,
    userId,
  );

  if (!isMatchedUser) {
    logger.debug("No match found with cached user.");
  }

  // Create client based on stored credentials
  if (accessToken && deviceId && userId && isMatchedUser) {
    logger.debug("Prepare matrix client using cached credentials.");

    return createClient({
      baseUrl: payload.baseUrl,
      deviceId,
      userId,
      accessToken,
    });
  }

  return undefined;
}

/**
 * Create and store a pickle key for encrypting react-sdk-crypto data..
 *
 * Returns the pickle key which can be used for the rust crypto store.
 */

async function initPickleKey(userId: string, deviceId: string) {
  let pickleKey = await getPickleKey(userId, deviceId);

  if (!pickleKey) {
    pickleKey = await createPickleKey(userId, deviceId);
    if (pickleKey) {
      logger.debug("Created pickle key");
    } else {
      logger.debug("Pickle key not created");
    }
  }

  return pickleKey;
}

async function createInitialClient(payload: ILoginParams) {
  let matrixClient = await createCachedClient(payload);

  // Send login request if credentials were not stored.
  if (!matrixClient) {
    matrixClient = await createLoggedInClient(payload);
  }

  return matrixClient;
}

async function getCredentials(matrixClient: MatrixClient) {
  try {
    const whoami = await matrixClient.whoami();
    const accessToken = matrixClient.getAccessToken() ?? undefined;

    if (!accessToken) {
      throw new Error("Unable to retrieve access token");
    }

    if (!whoami.device_id || !whoami.user_id) {
      throw new Error("Unable to retrieve whoami data");
    }

    const pickleKey = await initPickleKey(whoami.user_id, whoami.device_id);

    return {
      accessToken,
      userId: whoami.user_id,
      deviceId: whoami.device_id,
      pickleKey,
    };
  } catch (error) {
    logger.softError("Client verification failed");
    throw error;
  }
}

export async function chatLogin(baseUrl: string, selfUser: ApiUser) {
  const matrixClient = await createInitialClient({
    baseUrl,
    selfUser,
  });

  if (!matrixClient) {
    logger.softError("Temporary client creation failed");
    return;
  }

  // Verify created client and get credentials
  const credentials = await getCredentials(matrixClient);

  await persistCredentials(credentials);
  return credentials;
}

export async function chatLogout() {
  await deleteCachedCredentials();
}
