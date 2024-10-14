/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ClientEvent, MatrixClient } from "matrix-js-sdk/lib/client";
import { SyncState, createClient } from "matrix-js-sdk/lib/matrix";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useUpdateSelfUser } from "@/lib/baseModule/api/mutations/users";
import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import {
  fetchBackupInfo,
  getRustCryptoStoreArgs,
} from "@/lib/businessModules/chat/matrix/crypto";
import {
  cacheSecretStorageKey,
  getSecretStorageKey,
} from "@/lib/businessModules/chat/matrix/cryptoCallbacks";
import { chatLogin } from "@/lib/businessModules/chat/matrix/login";
import { restoreKeyBackupWithCache } from "@/lib/businessModules/chat/matrix/secretStorage";
import { clearCachedCredentials } from "@/lib/businessModules/chat/matrix/tokens";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { IStoredCredentials } from "@/lib/businessModules/chat/shared/types";
import {
  clearLoginToken,
  delayed,
  validateChatUsername,
} from "@/lib/businessModules/chat/shared/utils";

export function useChatLifecycle(
  matrixClient: MutableRefObject<MatrixClient>,
  clientState: ClientState,
  setClientState: Dispatch<SetStateAction<ClientState>>,
) {
  const { data: selfUser } = useGetSelfUser();
  const updateSelfUser = useUpdateSelfUser();

  const { configuration } = useChat();

  const baseUrl = configuration.MATRIX_SERVER_URL;

  const [credentials, setCredentials] = useState<IStoredCredentials>();
  const wasAuthenticated = useRef(false);

  const restartChat = useCallback(async () => {
    logger.warn("RESTARTING CHAT");

    await clearCachedCredentials();
    await matrixClient.current.clearStores();

    wasAuthenticated.current = false;
    setClientState(ClientState.Idle);
  }, [matrixClient, setClientState]);

  /**
   * Prepare the matrix client
   *
   * It creates a client and logs in using stored credentials or via SSO.
   * It verifies the logged-in user and caches the credentials.
   */
  const initChat = useCallback(async () => {
    if (wasAuthenticated.current) return;
    // Change this flag to avoid double render
    wasAuthenticated.current = true;

    logger.info("PREPARE MATRIX CLIENT");

    try {
      const creds = await chatLogin(baseUrl, selfUser);

      if (creds) {
        setCredentials(creds);
        setClientState(ClientState.Authorized);
      }
    } catch (error) {
      logger.error("Error logging into matrix chat:", error);
      setClientState(ClientState.Error);
    }
    void clearLoginToken();
  }, [baseUrl, selfUser, setClientState]);

  /**
   * Start the matrix client
   *
   * It creates and starts a new client based on verified credentials with crypto callbacks, and initiates Rust encryption.
   */
  const createChatClient = useCallback(async () => {
    if (!credentials) return;

    const { accessToken, deviceId, userId, pickleKey } = credentials;

    logger.info("CREATE MATRIX CLIENT");

    // New client for encryption
    matrixClient.current = createClient({
      baseUrl,
      deviceId,
      accessToken,
      userId,
      cryptoCallbacks: {
        getSecretStorageKey: (keys) =>
          getSecretStorageKey(keys, matrixClient.current),
        cacheSecretStorageKey,
      },
    });

    logger.info("Start matrix client as user:", userId);

    const rustCryptoStoreArgs = getRustCryptoStoreArgs(pickleKey);

    logger.info("INIT RUST CRYPTO");

    try {
      await matrixClient.current.initRustCrypto({
        storageKey: rustCryptoStoreArgs.rustCryptoStoreKey,
        storagePassword: rustCryptoStoreArgs.rustCryptoStorePassword,
      });
    } catch (error) {
      logger.error("Init Rust crypto error", error);
      setClientState(ClientState.Error);
      return;
    }

    setClientState(ClientState.ClientCreated);

    logger.info("START MATRIX CLIENT");

    await matrixClient.current.startClient({
      initialSyncLimit: 10,
      includeArchivedRooms: true,
    });
  }, [baseUrl, credentials, matrixClient, setClientState]);

  /**
   * Handle matrix encryption
   */
  const handleChatEncryption = useCallback(async () => {
    logger.info("HANDLE CHAT ENCRYPTION");
    try {
      let res = await fetchBackupInfo(matrixClient.current);

      if (!res.has4S && res.backupInfo) {
        res = await delayed(() => fetchBackupInfo(matrixClient.current), 300);
      }

      if (!res.has4S || !res.backupInfo) {
        setClientState(ClientState.CreateBackupKey);
      } else {
        const restored = await restoreKeyBackupWithCache(
          matrixClient.current,
          res.backupInfo,
        );

        if (!restored) {
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
  }, [matrixClient, setClientState]);

  const updateSelfUserChatUsername = useCallback(async () => {
    if (!matrixClient.current.isLoggedIn() || !credentials?.userId) return;

    if (!validateChatUsername(selfUser.externalChatUsername)) {
      await updateSelfUser
        .mutateAsync({
          externalChatUsername: credentials.userId,
          phoneNumber: selfUser.phoneNumber,
        })
        .catch((error) => {
          logger.softError("Error updating self user: ", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials?.userId, selfUser]);

  useEffect(() => {
    switch (clientState) {
      case ClientState.Idle:
        void initChat();
        break;
      case ClientState.Authorized:
        void createChatClient();
        break;
      case ClientState.ReadyForEncryption:
        void updateSelfUserChatUsername();
        void handleChatEncryption();
        break;
      case ClientState.Restart:
        void restartChat();
        break;
      default:
        break;
    }
  }, [
    clientState,
    createChatClient,
    handleChatEncryption,
    initChat,
    restartChat,
    updateSelfUserChatUsername,
  ]);

  const matrix = matrixClient.current;

  useEffect(() => {
    if (
      clientState !== ClientState.ClientCreated &&
      clientState !== ClientState.Prepared
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

    matrix.on(ClientEvent.Sync, handleSync);

    return () => {
      matrix.off(ClientEvent.Sync, handleSync);
    };
  }, [clientState, matrix, setClientState]);

  return null;
}
