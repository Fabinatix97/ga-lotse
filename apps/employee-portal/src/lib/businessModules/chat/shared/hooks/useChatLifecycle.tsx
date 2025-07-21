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
import { useBindKeycloakId } from "@/lib/businessModules/chat/api/mutations/userAccountApi";
import { useCreateOrUpdateUserSettings } from "@/lib/businessModules/chat/api/mutations/userSettingsApi";
import {
  getSelfUserChatAttributesQueryKey,
  useGetSelfUserChatAttributes,
} from "@/lib/businessModules/chat/api/queries/selfUserApi";
import {
  checkIfTabLockIsFree,
  claimTabLock,
} from "@/lib/businessModules/chat/matrix/chatTabLock";
import {
  createStorageKey,
  generateCryptoRandomUUID,
  isDeviceVerified,
} from "@/lib/businessModules/chat/matrix/crypto";
import {
  getSecretStorageKeyFromCache,
  saveSecretStorageKeyToCache,
} from "@/lib/businessModules/chat/matrix/cryptoCallbacks";
import {
  clearAllStoresOnUserChange,
  fetchFn,
  loginWithCachedDeviceOrWithNewDevice,
  loginWithNewDevice,
} from "@/lib/businessModules/chat/matrix/login";
import {
  deleteKeyBackupFromSecretStorage,
  hasKeyBackupInSecretStorage,
  restoreKeyBackupFromSecretStorage,
} from "@/lib/businessModules/chat/matrix/secretStorage";
import {
  clearAllStores,
  saveUserDeviceToLocalStorage,
} from "@/lib/businessModules/chat/matrix/tokens";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import {
  ChatTabTakeoverView,
  ClientState,
} from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { UserDevice } from "@/lib/businessModules/chat/shared/types";
import {
  setPresenceOffline,
  waitUntilCryptoApiIsInitialized,
} from "@/lib/businessModules/chat/shared/utils";

export function useChatLifecycle(
  matrixClient: MutableRefObject<MatrixClient>,
  clientState: ClientState,
  setClientState: Dispatch<SetStateAction<ClientState>>,
  currentSessionView: ChatTabTakeoverView,
  setCurrentSessionView: Dispatch<SetStateAction<ChatTabTakeoverView>>,
  monitorChatActivity: (url?: RequestInfo | URL) => void,
) {
  const { data: selfUserChatAttributesData } = useGetSelfUserChatAttributes();
  const { configuration, userSettings } = useChat();

  const { mutateAsync: bindKeycloakIdToSynapseUser } = useBindKeycloakId();
  const { mutateAsync: registerAccount } = useCreateOrUpdateUserSettings();
  const { mutateAsync: updateSelfUserChatAttributes } =
    useUpdateSelfUserChatAttributes();

  const baseUrl = configuration.PUBLIC_MATRIX_SERVER_URL;
  const userDeviceRef = useRef<UserDevice | null>(null);
  const wasRegisterFlowStarted = useRef(false);
  const wasExternalChatUsernameUpdated = useRef(false);
  const wasMatrixClientInitialized = useRef(false);
  const wasRustCryptoInitialized = useRef(false);
  const isInitEncryptionStarted = useRef(false);
  const userWasJustRegistered = useRef(false);
  const queryClient = useQueryClient();
  const wasTabLockStarted = useRef(false);

  const onLockTakenByAnotherTab = useCallback(async () => {
    await new Promise<void>((resolve) => {
      setCurrentSessionView(ChatTabTakeoverView.LockClaimedByAnotherTab);
      resolve();
    });
    matrixClient.current.stopClient();
  }, [matrixClient, setCurrentSessionView]);

  useEffect(() => {
    void (async () => {
      if (wasTabLockStarted.current) return;
      wasTabLockStarted.current = true;
      if (!checkIfTabLockIsFree()) {
        setCurrentSessionView(ChatTabTakeoverView.ClaimTabLock);
      } else {
        await claimTabLock(() => onLockTakenByAnotherTab());
      }
    })();
  }, [onLockTakenByAnotherTab, setCurrentSessionView]);

  function resetClientStateFlags() {
    wasRegisterFlowStarted.current = false;
    wasExternalChatUsernameUpdated.current = false;
    wasMatrixClientInitialized.current = false;
    isInitEncryptionStarted.current = false;
    wasRustCryptoInitialized.current = false;
  }

  /**
   * WARNING: To be used only if user lost E2EE passphrase.
   * This action **will delete forever** current 4S E2EE keyBackup from the server and user
   * will never be able to access current message history again.
   */
  const factoryResetChat = useCallback(async () => {
    logger.warn("FACTORY RESET CHAT");
    matrixClient.current.stopClient();
    await deleteKeyBackupFromSecretStorage(matrixClient.current);
    await clearAllStores();
    resetClientStateFlags();
    setClientState(ClientState.CreateMatrixClient);
  }, [setClientState, matrixClient]);

  /**
   * Clears locally cached keyBackup, restarts matrixClient and triggers downloading fresh key backup from Synapse's 4S
   */
  const hardResetChat = useCallback(async () => {
    logger.warn("HARD RESET CHAT");
    matrixClient.current.stopClient();
    await clearAllStores();
    resetClientStateFlags();
    setClientState(ClientState.CreateMatrixClient);
  }, [setClientState, matrixClient]);

  /**
   * Restarts matrixClient with cached keyBackup
   */
  const restartChat = useCallback(() => {
    logger.warn("REFRESHING CHAT");
    resetClientStateFlags();
    setClientState(ClientState.CreateMatrixClient);
  }, [setClientState]);

  const stopClient = useCallback(() => {
    void setPresenceOffline(matrixClient.current).then(() => {
      matrixClient.current.stopClient();
    });
  }, [matrixClient]);

  /**
   * User's first time ever request to Synapse triggers Synapse to register new Matrix User Account
   * Then chat-management is called to create synapse user mapping with keycloak user id.
   * This ensures proper behavior of requests that require User-Interactive Authentication (E2EE passphrase reset, account deactivation).
   */
  const registerChatUser = useCallback(async () => {
    if (!selfUserChatAttributesData?.userId) return;
    if (wasRegisterFlowStarted.current) return;
    wasRegisterFlowStarted.current = true;
    logger.info("Step 0/5: registerChatUser");

    if (userSettings.accountRegistered) {
      logger.debug("User Matrix Account already registered, skipping.");
      wasMatrixClientInitialized.current = false;
      setClientState(ClientState.CreateMatrixClient);
      return;
    }

    try {
      const userDevice: UserDevice = await loginWithNewDevice(baseUrl);
      saveUserDeviceToLocalStorage(userDevice);

      logger.debug(
        "Binding Keycloak User ID to Synapse User:",
        userDevice.userId,
      );
      await bindKeycloakIdToSynapseUser({
        matrixUserId: userDevice.userId,
      }).catch((error) => {
        throw new Error(`Error binding keycloak id to synapse user: ${error}`);
      });

      logger.debug(
        "Binding Synapse User ID (MXID) to Keycloak User:",
        userDevice.userId,
      );
      try {
        await updateSelfUserChatAttributes({
          externalChatUsername: userDevice.userId,
          chatCryptoStoreDeriveKeySecret: generateCryptoRandomUUID(),
        });
        await queryClient.invalidateQueries({
          queryKey: getSelfUserChatAttributesQueryKey(),
        });
      } catch (err) {
        throw new Error("Error updating keycloak user's chat attributes", {
          cause: err,
        });
      }

      await registerAccount({
        userId: selfUserChatAttributesData.userId,
        accountRegistered: true,
      }).catch((error) => {
        throw new Error(`Error marking user as registered: ${error}`);
      });

      logger.info("Step 0/5: registerChatUser - FINISHED");
      userWasJustRegistered.current = true;
      wasMatrixClientInitialized.current = false;
      setClientState(ClientState.CreateMatrixClient);
    } catch (error) {
      logger.error("Error registerChatUser", error);
      setClientState(ClientState.Error);
    }
  }, [
    baseUrl,
    registerAccount,
    bindKeycloakIdToSynapseUser,
    selfUserChatAttributesData,
    setClientState,
    updateSelfUserChatAttributes,
    userSettings.accountRegistered,
    queryClient,
  ]);

  /**
   * Create matrix client based on verified credentials with crypto callbacks
   * - Login to Matrix Server and get deviceId (use cached deviceId if present)
   * - Cache deviceId and matrix userId in local storage
   * - Create MatrixClient
   */
  const createMatrixClient = useCallback(async () => {
    if (
      !selfUserChatAttributesData?.userId ||
      !selfUserChatAttributesData.externalChatUsername
    )
      return;
    if (wasMatrixClientInitialized.current) return;
    wasMatrixClientInitialized.current = true;
    logger.info("Step 1/5: createMatrixClient");

    void clearAllStoresOnUserChange(
      selfUserChatAttributesData.externalChatUsername,
    );

    if (!userSettings.accountRegistered && !userWasJustRegistered.current) {
      logger.info(
        "User Matrix Account not yet registered. Starting registration.",
      );
      return setClientState(ClientState.RegisterMatrixUser);
    }

    try {
      const userDevice: UserDevice = await loginWithCachedDeviceOrWithNewDevice(
        baseUrl,
        selfUserChatAttributesData.externalChatUsername,
      );

      userDeviceRef.current = userDevice;

      matrixClient.current = createClient({
        baseUrl: baseUrl,
        deviceId: userDevice.deviceId,
        userId: userDevice.userId,
        fetchFn: (input, init) =>
          fetchFn(input, init, userDevice.deviceId, monitorChatActivity),
        cryptoCallbacks: {
          getSecretStorageKey: (keys) =>
            getSecretStorageKeyFromCache(keys, matrixClient.current),
          cacheSecretStorageKey: (keyId, keyInfo, key) =>
            saveSecretStorageKeyToCache(keyId, keyInfo, key),
        },
      });

      if (
        userDevice.userId !== selfUserChatAttributesData.externalChatUsername
      ) {
        logger.warn(
          "Incorrect or missing externalChatUsername, updating with correct MXID",
        );
        try {
          await updateSelfUserChatAttributes({
            externalChatUsername: userDevice.userId,
          });
        } catch (err) {
          throw new Error(
            "Error updating keycloak user's externalChatUsername",
            {
              cause: err,
            },
          );
        }
      }

      setClientState(ClientState.StartMatrixClient);
    } catch (error) {
      logger.error("Error createMatrixClient:", error);
      setClientState(ClientState.Error);
    }
    logger.info("Step 1/5: createMatrixClient - FINISHED");
  }, [
    baseUrl,
    matrixClient,
    monitorChatActivity,
    selfUserChatAttributesData,
    setClientState,
    updateSelfUserChatAttributes,
    userSettings.accountRegistered,
  ]);

  /**
   * Initiate matrix-sdk-crypto-wasm for E2EE communication and start matrixClient.
   */
  const initRustCryptoAndStartMatrixClient = useCallback(async () => {
    if (!selfUserChatAttributesData?.chatCryptoStoreDeriveKeySecret) return;
    if (wasRustCryptoInitialized.current) return;
    wasRustCryptoInitialized.current = true;

    try {
      logger.info("Step 2/5: initRustCrypto");

      const userId = matrixClient.current.getUserId() ?? "";
      const deviceId = matrixClient.current.getDeviceId() ?? "";
      let chatCryptoStoreDeriveKeySecret =
        selfUserChatAttributesData.chatCryptoStoreDeriveKeySecret;

      if (!chatCryptoStoreDeriveKeySecret) {
        logger.warn(
          "MISSING chatCryptoStoreDeriveKeySecret, generating new one.",
        );
        try {
          chatCryptoStoreDeriveKeySecret = generateCryptoRandomUUID();
          await updateSelfUserChatAttributes({
            chatCryptoStoreDeriveKeySecret: chatCryptoStoreDeriveKeySecret,
          });
        } catch (err) {
          throw new Error(
            "Error updating keycloak user's chatCryptoStoreDeriveKeySecret",
            {
              cause: err,
            },
          );
        }
      }

      const storageKey = await createStorageKey(
        userId,
        deviceId,
        chatCryptoStoreDeriveKeySecret,
      );

      await matrixClient.current.initRustCrypto({
        storageKey,
      });
      await waitUntilCryptoApiIsInitialized(matrixClient.current);
      logger.info("Step 2/5: initRustCrypto - FINISHED");

      logger.info("Step 3/5: startMatrixClient");
      await matrixClient.current.startClient({
        initialSyncLimit: 20,
        disablePresence: !userSettings.sharePresence,
      });

      logger.info("Step 3/5: startMatrixClient - FINISHED");
      setClientState(ClientState.WaitUntilClientPrepared);
    } catch (error) {
      logger.error("Error starting matrix client", error);
      setClientState(ClientState.Error);
    }
  }, [
    userSettings.sharePresence,
    matrixClient,
    setClientState,
    selfUserChatAttributesData,
    updateSelfUserChatAttributes,
  ]);

  /**
   * Checks for E2EE key backup in 4S
   */
  const initChatEncryption = useCallback(async () => {
    if (isInitEncryptionStarted.current) return;
    isInitEncryptionStarted.current = true;

    logger.info("Step 5/5: initEncryption");
    try {
      const hasBackupInSecretStorage: boolean =
        await hasKeyBackupInSecretStorage(matrixClient.current);

      if (hasBackupInSecretStorage) {
        //TODO: export function, use it in CreateBackupSidebar and RestoreBackupSidebar
        const keyBackupRestoreResult = await restoreKeyBackupFromSecretStorage(
          matrixClient.current,
        );
        logger.debug({ keyBackupRestoreResult });

        const isVerifiedDevice = await isDeviceVerified(matrixClient.current);
        logger.debug({ isVerifiedDevice });

        if (!keyBackupRestoreResult || !isVerifiedDevice) {
          logger.warn("Failed to restore keyBackup or device is not verified.");
          setClientState(ClientState.RestoreKeyBackup);
        } else {
          setClientState(ClientState.Ready);
        }
      } else {
        setClientState(ClientState.CreateKeyBackup);
      }
    } catch (error) {
      logger.error("Error initChatEncryption", error);
      matrixClient.current.stopClient();
      setClientState(ClientState.Error);
    }
    logger.info("Step 5/5: initEncryption - FINISHED");
  }, [matrixClient, setClientState]);

  const updateMatrixUserDisplayName = useCallback(async () => {
    if (
      !selfUserChatAttributesData?.firstName ||
      !selfUserChatAttributesData?.lastName
    )
      return;
    if (!userDeviceRef.current?.userId) return;

    try {
      const profile = await matrixClient.current.getProfileInfo(
        userDeviceRef.current.userId,
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
  }, [matrixClient, selfUserChatAttributesData]);

  useEffect(() => {
    switch (clientState) {
      case ClientState.RegisterMatrixUser:
        void registerChatUser();
        break;
      case ClientState.CreateMatrixClient:
        void createMatrixClient();
        break;
      case ClientState.StartMatrixClient:
        void initRustCryptoAndStartMatrixClient();
        break;
      case ClientState.InitEncryption:
        void updateMatrixUserDisplayName();
        void initChatEncryption();
        break;
      case ClientState.Restart:
        void restartChat();
        break;
      case ClientState.HardReset:
        void hardResetChat();
        break;
      case ClientState.FactoryReset:
        void factoryResetChat();
        break;
      case ClientState.Idle:
        stopClient();
        break;
      default:
        break;
    }
  }, [
    clientState,
    createMatrixClient,
    factoryResetChat,
    hardResetChat,
    initChatEncryption,
    initRustCryptoAndStartMatrixClient,
    registerChatUser,
    restartChat,
    stopClient,
    updateMatrixUserDisplayName,
  ]);

  useEffect(() => {
    if (clientState !== ClientState.WaitUntilClientPrepared) {
      return;
    }

    logger.info("Step 4/5: WaitUntilClientPrepared");
    matrixClient.current.on(ClientEvent.Sync, syncStateEventHandler);
    return () => {
      matrixClient.current.off(ClientEvent.Sync, syncStateEventHandler);
    };

    function syncStateEventHandler(state: SyncState) {
      logger.info("SyncState", state);
      switch (state) {
        case SyncState.Prepared:
          logger.info("Step 4/5: WaitUntilClientPrepared - FINISHED");
          setClientState(ClientState.InitEncryption);
          break;
        case SyncState.Error:
          logger.error("SyncState", state);
          setClientState(ClientState.Error);
        default:
          break;
      }
    }
  }, [clientState, matrixClient, setClientState]);

  return null;
}
