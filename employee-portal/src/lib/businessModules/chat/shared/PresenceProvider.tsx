/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ClientEvent, MatrixEvent, User, UserEvent } from "matrix-js-sdk";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isNullish } from "remeda";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import {
  Presence,
  UsersPresence,
} from "@/lib/businessModules/chat/shared/types";

interface PresenceContextType {
  usersPresence: UsersPresence;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

export function PresenceProvider({ children }: Readonly<RequiresChildren>) {
  const { matrixClient, isClientPrepared } = useChatClientContext();
  const {
    userSettings: { sharePresence },
  } = useChat();
  const [usersPresence, setUsersPresence] = useState<UsersPresence>({});

  useEffect(() => {
    if (!matrixClient || !isClientPrepared || !sharePresence) return;

    const users = matrixClient.getUsers();
    const statuses = Object.fromEntries(
      users.map((user) => [user.userId, user.presence]),
    ) as UsersPresence;
    setUsersPresence(statuses);
  }, [isClientPrepared, matrixClient, sharePresence]);

  useEffect(() => {
    if (!isClientPrepared) return;

    function handleUserPresence(event?: MatrixEvent, user?: User) {
      const eventType = event?.getType();
      if (!event || eventType !== "m.presence") return;
      const eventContent = event?.getContent();
      if (user && eventContent) {
        setUsersPresence((prevState) => ({
          ...prevState,
          [user.userId]: eventContent.presence as Presence,
        }));
        return;
      }
      const sender = event.getSender();
      const status = eventContent.presence as Presence;
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

    matrixClient?.on(ClientEvent.Event, handleUserPresence);
    matrixClient?.on(UserEvent.CurrentlyActive, handleUserPresence);

    return () => {
      matrixClient?.removeListener(ClientEvent.Event, handleUserPresence);
      matrixClient?.removeListener(
        UserEvent.CurrentlyActive,
        handleUserPresence,
      );
    };
  }, [isClientPrepared, matrixClient, sharePresence, usersPresence]);

  const contextValues = useMemo<PresenceContextType>(
    () => ({
      usersPresence: sharePresence ? usersPresence : {},
    }),
    [sharePresence, usersPresence],
  );

  return <PresenceContext value={contextValues}>{children}</PresenceContext>;
}

export function usePresenceContext() {
  const presenceContext = useContext(PresenceContext);
  if (isNullish(presenceContext)) {
    throw new Error("usePresenceContext was called outside PresenceProvider");
  }
  return presenceContext;
}
