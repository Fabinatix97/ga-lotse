/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { ClientEvent, MatrixEvent, User, UserEvent } from "matrix-js-sdk";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isNullish } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import {
  Presence,
  UsersPresence,
} from "@/lib/businessModules/chat/shared/types";

export interface PresenceContextType {
  usersPresence: UsersPresence;
}

export const PresenceContext = createContext<PresenceContextType | null>(null);

export function PresenceProvider({ children }: Readonly<RequiresChildren>) {
  const { matrixClient, clientState } = useChatClientContext();
  const {
    userSettings: { sharePresence },
  } = useChat();
  const [usersPresence, setUsersPresence] = useState<UsersPresence>({});

  useEffect(() => {
    if (!matrixClient) return;
    if (clientState !== ClientState.Prepared) return;
    if (!sharePresence) return;
    const users = matrixClient.getUsers();
    const statuses = Object.fromEntries(
      users.map((user) => [user.userId, user.presence]),
    ) as UsersPresence;
    setUsersPresence(statuses);
  }, [clientState, matrixClient, sharePresence]);

  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;

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
  }, [clientState, matrixClient, sharePresence, usersPresence]);

  const contextValues = useMemo<PresenceContextType>(
    () => ({
      usersPresence: sharePresence ? usersPresence : {},
    }),
    [sharePresence, usersPresence],
  );

  return (
    <PresenceContext.Provider value={contextValues}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresenceContext() {
  const presenceContext = useContext(PresenceContext);
  if (isNullish(presenceContext)) {
    throw new Error("usePresenceContext was called outside PresenceProvider");
  }
  return presenceContext;
}
