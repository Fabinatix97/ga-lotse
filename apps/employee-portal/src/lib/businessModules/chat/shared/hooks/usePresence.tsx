/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ClientEvent, MatrixEvent, SyncState } from "matrix-js-sdk";
import { useContext, useEffect, useState } from "react";
import { omit } from "remeda";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import {
  Presence,
  UsersPresence,
} from "@/lib/businessModules/chat/shared/types";

export function usePresence(userId?: string) {
  const {
    userSettings: { sharePresence, accountDeactivated },
  } = useChat();
  const chatContext = useContext(ChatClientContext);
  const { matrixClient, isClientPrepared } = chatContext ?? {};
  const [usersPresence, setUsersPresence] = useState<UsersPresence>({});

  // Get initial users presence
  useEffect(() => {
    if (!matrixClient || !isClientPrepared || accountDeactivated) return;

    if (userId) {
      const user = matrixClient.getUser(userId);
      setUsersPresence({ [userId]: user?.presence } as UsersPresence);
    } else {
      const users = matrixClient.getUsers();
      const statuses = Object.fromEntries(
        users.map((user) => [user.userId, user.presence]),
      ) as UsersPresence;
      setUsersPresence(statuses);
    }
  }, [accountDeactivated, isClientPrepared, matrixClient, userId]);

  useEffect(() => {
    if (!isClientPrepared || accountDeactivated) return;

    function handleUserPresence(event: MatrixEvent) {
      const eventType = event.getType();
      if (eventType === "m.presence") {
        const sender = event.event.sender;
        if (userId && sender !== userId) return;
        const status = event.event.content?.presence as Presence;
        if (!sender || !status) {
          return;
        }
        // if presence is the same, then don't update state
        if (usersPresence[sender] === status) {
          return;
        }

        setUsersPresence((prevState) => ({
          ...prevState,
          [sender]: status,
        }));
      }
    }

    matrixClient?.on(ClientEvent.Event, handleUserPresence);

    return () => {
      matrixClient?.removeListener(ClientEvent.Event, handleUserPresence);
    };
  }, [
    accountDeactivated,
    isClientPrepared,
    matrixClient,
    sharePresence,
    userId,
    usersPresence,
  ]);

  useEffect(() => {
    if (!isClientPrepared || !matrixClient) return;

    function handleStoppedSync(state: SyncState) {
      if (state === SyncState.Stopped && userId) {
        setUsersPresence((prevState) => omit(prevState, [userId]));
      }
    }

    matrixClient.on(ClientEvent.Sync, handleStoppedSync);

    return () => {
      matrixClient.off(ClientEvent.Sync, handleStoppedSync);
    };
  }, [isClientPrepared, matrixClient, userId]);

  return { usersPresence: sharePresence ? usersPresence : {} };
}
