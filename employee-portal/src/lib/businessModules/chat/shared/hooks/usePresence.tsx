/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ClientEvent,
  MatrixClient,
  MatrixEvent,
  SetPresence,
  SyncState,
} from "matrix-js-sdk/lib/matrix";
import { useEffect, useState } from "react";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { Presence } from "@/lib/businessModules/chat/shared/types";

export function usePresence(
  matrixClient: MatrixClient,
  clientState: ClientState,
) {
  const {
    userSettings: { sharePresence },
  } = useChat();
  const [usersPresence, setUsersPresence] = useState<Record<string, Presence>>(
    {},
  );
  useEffect(() => {
    matrixClient.once(ClientEvent.Sync, function (state) {
      if (state === SyncState.Prepared) {
        const users = matrixClient.getUsers();
        const statuses = Object.fromEntries(
          users.map((user) => [user.userId, user.presence]),
        ) as Record<string, Presence>;
        setUsersPresence(statuses);
      }
    });
  }, [matrixClient]);

  useEffect(() => {
    void (async () => {
      if (clientState !== ClientState.Prepared) {
        return;
      }

      if (!sharePresence) {
        await matrixClient.setSyncPresence(SetPresence.Offline);
        await matrixClient.setPresence({ presence: "offline" });
      } else {
        await matrixClient.setSyncPresence(SetPresence.Online);
        await matrixClient.setPresence({ presence: "online" });
      }
    })();
  }, [clientState, matrixClient, sharePresence]);

  useEffect(() => {
    function handleUserPresence(event: MatrixEvent) {
      const eventType = event.getType();
      if (eventType === "m.presence") {
        const sender = event.event.sender;
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

    matrixClient.on(ClientEvent.Event, handleUserPresence);

    return () => {
      matrixClient.removeListener(ClientEvent.Event, handleUserPresence);
    };
  }, [matrixClient, sharePresence, usersPresence]);
  return { usersPresence };
}
