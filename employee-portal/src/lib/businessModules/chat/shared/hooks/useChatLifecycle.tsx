/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueryClient } from "@tanstack/react-query";
import {
  ClientEvent,
  MatrixClient,
  SyncState,
  createClient,
} from "matrix-js-sdk";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { useUpdateSelfUserChatAttributes } from "@/lib/businessModules/chat/api/mutations/selfUserApi";
import { useCreateOrUpdateUserSettings } from "@/lib/businessModules/chat/api/mutations/userSettingsApi";
import {
  getSelfUserChatAttributesQueryKey,
  useGetSelfUserChatAttributes,
} from "@/lib/businessModules/chat/api/queries/selfUserApi";
import {
  createStorageKey,
  generateCryptoRandomUUID,
  isDeviceVerified,
} from "@/lib/businessModules/chat/matrix/crypto";
import {
  cacheSecretStorageKey,
  getSecretStorageKey,
} from "@/lib/businessModules/chat/matrix/cryptoCallbacks";
import {
  createTemporaryMatrixClient,
  fetchFn,
  getCredentials,
  requestCredentials,
} from "@/lib/businessModules/chat/matrix/login";
import { restoreKeyBackupFromCache } from "@/lib/businessModules/chat/matrix/secretStorage";
import {
  clearCachedCredentials,
  clearMatrixStores,
  persistCredentials,
} from "@/lib/businessModules/chat/matrix/tokens";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { IStoredCredentials } from "@/lib/businessModules/chat/shared/types";
import {
  clearSearchParams,
  fetchBackupInfoWithRetry,
  waitUntilCryptoApiIsInitialized,
} from "@/lib/businessModules/chat/shared/utils";

export function useChatLifecycle(
  matrixClient: MutableRefObject<MatrixClient>,
  clientState: ClientState,
  setClientState: Dispatch<SetStateAction<ClientState>>,
) {
  const { data: selfUserChatAttributesData } = useGetSelfUserChatAttributes();
  const { configuration, userSettings } = useChat();

  const { mutateAsync: registerAccount } = useCreateOrUpdateUserSettings();
  const { mutateAsync: updateSelfUserChatAttributes } =
    useUpdateSelfUserChatAttributes();

  const baseUrl = configuration.PUBLIC_MATRIX_SERVER_URL;
  const credentialsRef = useRef<IStoredCredentials | null>(null);
  const wasRegisterFlowStarted = useRef(false);
  const wasRegisterFlowFinished = useRef(false);
  const wasExternalChatUsernameUpdated = useRef(false);
  const wasMatrixClientInitialized = useRef(false);
  const wasRustCryptoInitialized = useRef(false);
  const queryClient = useQueryClient();

  function resetClientStateFlags() {
    wasRegisterFlowStarted.current = false;
    wasExternalChatUsernameUpdated.current = false;
    wasMatrixClientInitialized.current = false;
    wasRustCryptoInitialized.current = false;
  }

  /**
   * Resets the chat client by stopping the matrix client, resetting client state flags,
   * clearing cached credentials, and clearing the matrix stores. Finally, it sets the client state to `Idle`.
   */
  const resetChat = useCallback(async () => {
    logger.warn("RESETTING CHAT");

    matrixClient.current.stopClient();
    resetClientStateFlags();
    clearCachedCredentials();
    await clearMatrixStores();
    setClientState(ClientState.Idle);
  }, [setClientState, matrixClient]);

  /**
   * Restarts the chat client by resetting the client state flags and setting the client state to `Idle`.
   * This function is typically used to perform a soft reset of the chat.
   */
  const restartChat = useCallback(() => {
    logger.warn("RESTARTING CHAT");

    resetClientStateFlags();
    setClientState(ClientState.Idle);
  }, [setClientState]);

  /**
   * First ever whoami request creates synapse user account.
   * Then Chat management is called to create synapse user mapping with keycloak user id.
   * This ensures proper behavior of requests that require User-Interactive Authentication (E2EE passphrase reset, account deactivation).
   */
  const registerChatUser = useCallback(async () => {
    if (wasRegisterFlowStarted.current) return;
    wasRegisterFlowStarted.current = true;
    logger.info("Step 0/4: REGISTER NEW CHAT USER");

    if (userSettings.accountRegistered) {
      logger.info("Account already registered, skipping");
      wasMatrixClientInitialized.current = false;
      return setClientState(ClientState.Idle);
    }

    try {
      const temporaryMatrixClient = createTemporaryMatrixClient(baseUrl);
      const credentials = await requestCredentials(temporaryMatrixClient);
      persistCredentials(credentials);

      try {
        await updateSelfUserChatAttributes({
          externalChatUsername: credentials.userId,
          chatCryptoStoreDeriveKeySecret: generateCryptoRandomUUID(),
        });
        await queryClient.invalidateQueries({
          queryKey: getSelfUserChatAttributesQueryKey(),
        });
      } catch (err) {
        throw new Error("Error updating keycloak chatUser", {
          cause: err,
        });
      }

      try {
        await registerAccount({
          userId: selfUserChatAttributesData.userId,
          accountRegistered: true,
        });
      } catch (err) {
        throw new Error("Error marking user as registered", {
          cause: err,
        });
      }

      logger.info("Registered new chat user: ", credentials);
      wasRegisterFlowFinished.current = true;
      setClientState(ClientState.Restart);
    } catch (error) {
      logger.error("Failed to register chat user", error);
      setClientState(ClientState.Error);
    }
    clearSearchParams(chatSearchParamNames.loginToken);
  }, [
    baseUrl,
    registerAccount,
    selfUserChatAttributesData.userId,
    setClientState,
    updateSelfUserChatAttributes,
    userSettings.accountRegistered,
    queryClient,
  ]);

  /**
   * Create matrix client based on verified credentials with crypto callbacks
   * - Call whoami endpoint to check if user is authenticated
   * - Cache deviceId and matrix userId
   * - Verify logged-in user with cached matrix userId
   */
  const initMatrixClient = useCallback(async () => {
    if (wasMatrixClientInitialized.current) return;
    wasMatrixClientInitialized.current = true;

    if (!userSettings.accountRegistered && !wasRegisterFlowFinished.current) {
      logger.info(
        "INIT MATRIX CLIENT: Account not yet registered, starting register flow",
      );
      return setClientState(ClientState.Registration);
    }

    logger.info("Step 1/4: INIT MATRIX CLIENT");

    try {
      const credentials = await getCredentials(
        baseUrl,
        selfUserChatAttributesData.externalChatUsername,
      );

      logger.info("Setting credentialsRef: ", credentials);
      credentialsRef.current = credentials;

      matrixClient.current = createClient({
        baseUrl: baseUrl,
        deviceId: credentials.deviceId,
        userId: credentials.userId,
        fetchFn: (input, init) => fetchFn(input, init, credentials.deviceId),
        cryptoCallbacks: {
          getSecretStorageKey: (keys) =>
            getSecretStorageKey(keys, matrixClient.current),
          cacheSecretStorageKey,
        },
      });

      setClientState(ClientState.Authorized);
    } catch (error) {
      logger.error("Error logging into matrix chat:", error);
      setClientState(ClientState.Error);
    }
    logger.info("FINISHED Step 1/4: INIT MATRIX CLIENT");
  }, [
    baseUrl,
    matrixClient,
    selfUserChatAttributesData.externalChatUsername,
    setClientState,
    userSettings.accountRegistered,
  ]);

  /**
   * Initiate matrix-sdk-crypto-wasm for E2EE communication and start matrixClient.
   */
  const initRustCryptoAndStartMatrixClient = useCallback(async () => {
    if (wasRustCryptoInitialized.current || !credentialsRef.current?.deviceId)
      return;
    wasRustCryptoInitialized.current = true;

    try {
      logger.info("Step 2/4: INIT RUST CRYPTO");

      if (!selfUserChatAttributesData.chatCryptoStoreDeriveKeySecret) {
        throw new Error(
          "Unable to init E2EE - please setup chatCryptoStoreDeriveKeySecret.",
        );
      }

      const storageKey = await createStorageKey(
        selfUserChatAttributesData.userId,
        credentialsRef.current.deviceId,
        selfUserChatAttributesData.chatCryptoStoreDeriveKeySecret,
      );
      await matrixClient.current.initRustCrypto({
        storageKey,
      });
      await waitUntilCryptoApiIsInitialized(matrixClient.current);
      logger.info("FINISHED Step 2/4: INIT RUST CRYPTO");

      //Changing the client's state to ClientCreated will initiate listening for sync events.
      setClientState(ClientState.ClientCreated);

      logger.info("Step 3/4: START MATRIX CLIENT");
      await matrixClient.current.startClient({
        initialSyncLimit: 20,
      });
      logger.info("FINISHED Step 3/4: START MATRIX CLIENT");
    } catch (error) {
      logger.error("Error starting matrix client", error);
      setClientState(ClientState.Error);
    }
  }, [matrixClient, setClientState, selfUserChatAttributesData]);

  /**
   * Initialize E2EE key stores
   */
  const initChatEncryption = useCallback(async () => {
    logger.info("Step 4/4: INIT CHAT ENCRYPTION");
    try {
      const backupInfo = await fetchBackupInfoWithRetry(matrixClient.current);

      if (!backupInfo?.has4SKey || !backupInfo?.keyBackupInfo) {
        setClientState(ClientState.CreateBackupKey);
      } else {
        const isKeyBackupRestored = await restoreKeyBackupFromCache(
          matrixClient.current,
        );

        const isVerifiedDevice = await isDeviceVerified(matrixClient.current);

        if (!isKeyBackupRestored || !isVerifiedDevice) {
          setClientState(ClientState.RestoreBackupKey);
        } else {
          setClientState(ClientState.Prepared);
        }
      }
    } catch (error) {
      logger.error("Encryption Error: ", error);
      matrixClient.current.stopClient();
      setClientState(ClientState.Error);
    }
    logger.info("FINISHED Step 4/4: INIT CHAT ENCRYPTION");
  }, [matrixClient, setClientState]);

  const updateMatrixUserDisplayName = useCallback(async () => {
    if (!credentialsRef.current?.userId) return;

    try {
      const profile = await matrixClient.current.getProfileInfo(
        credentialsRef.current.userId,
        "displayname",
      );
      const matrixUserDisplayName =
        selfUserChatAttributesData.firstName +
        " " +
        selfUserChatAttributesData.lastName;
      if (matrixUserDisplayName !== profile?.displayname) {
        logger.info("Updating matrixUserDisplayName: " + matrixUserDisplayName);
        await matrixClient.current.setDisplayName(matrixUserDisplayName);
      }
    } catch (error) {
      logger.softError("Error updating matrix user displayName: ", error);
    }
  }, [
    matrixClient,
    selfUserChatAttributesData.firstName,
    selfUserChatAttributesData.lastName,
  ]);

  const updateSelfUserChatUsername = useCallback(async () => {
    if (!credentialsRef.current?.userId) return;
    if (wasExternalChatUsernameUpdated.current) return;

    if (
      credentialsRef.current.userId !==
      selfUserChatAttributesData.externalChatUsername
    ) {
      logger.info(
        "Updating selfUser externalChatUsername: ",
        credentialsRef.current.userId,
      );

      wasExternalChatUsernameUpdated.current = true;

      await updateSelfUserChatAttributes({
        externalChatUsername: credentialsRef.current.userId,
      }).catch((error) => {
        wasExternalChatUsernameUpdated.current = false;
        logger.softError("Error updating selfUser's chat userId: ", error);
      });
    }
  }, [selfUserChatAttributesData, updateSelfUserChatAttributes]);

  useEffect(() => {
    switch (clientState) {
      case ClientState.Registration:
        void registerChatUser();
        break;
      case ClientState.Idle:
        void initMatrixClient();
        break;
      case ClientState.Authorized:
        void initRustCryptoAndStartMatrixClient();
        break;
      case ClientState.ReadyForEncryption:
        void updateMatrixUserDisplayName();
        void updateSelfUserChatUsername();
        void initChatEncryption();
        break;
      case ClientState.Restart:
        void restartChat();
        break;
      case ClientState.Reset:
        void resetChat();
        break;
      default:
        break;
    }
  }, [
    clientState,
    initRustCryptoAndStartMatrixClient,
    initChatEncryption,
    initMatrixClient,
    resetChat,
    updateMatrixUserDisplayName,
    updateSelfUserChatUsername,
    registerChatUser,
    restartChat,
  ]);

  useEffect(() => {
    if (
      clientState === ClientState.Idle ||
      clientState === ClientState.Authorized
    )
      return;

    function handleSync(state: SyncState) {
      logger.debug("SyncState", state);
      switch (state) {
        case SyncState.Prepared:
          setClientState(ClientState.ReadyForEncryption);
          break;
        case SyncState.Error:
          setClientState(ClientState.Error);
        default:
          break;
      }
    }

    matrixClient.current.on(ClientEvent.Sync, handleSync);

    return () => {
      matrixClient.current.off(ClientEvent.Sync, handleSync);
    };
  }, [clientState, matrixClient, setClientState]);

  return null;
}
