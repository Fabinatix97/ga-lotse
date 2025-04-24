/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiGetDepartmentInfoResponse } from "@eshg/base-api";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  MatrixClient,
  MatrixEvent,
  Room,
  RoomEvent,
  createClient,
} from "matrix-js-sdk";
import { KnownMembership, Membership } from "matrix-js-sdk/lib/types";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isNullish } from "remeda";

import { useGetDepartment } from "@/lib/businessModules/chat/api/queries/department";
import { useMessageTeaser } from "@/lib/businessModules/chat/components/messageTeaser/MessageTeaserProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatLifecycle } from "@/lib/businessModules/chat/shared/hooks/useChatLifecycle";
import { useIdleTimerHook } from "@/lib/businessModules/chat/shared/hooks/useIdleTimerHook";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import {
  RoomEventDetails,
  isMessageTypeWithBody,
} from "@/lib/businessModules/chat/shared/types";
import {
  getRoomCommunicationType,
  isGroupRoom,
  shouldShowMessageTeaser,
} from "@/lib/businessModules/chat/shared/utils";

export interface ChatClientContextType {
  matrixClient: MatrixClient;
  clientState: ClientState;
  setClientState: Dispatch<SetStateAction<ClientState>>;
  departmentInfo?: ApiGetDepartmentInfoResponse;
  isClientPrepared: boolean;
}

export const ChatClientContext = createContext<ChatClientContextType | null>(
  null,
);

export function ChatClientProvider({ children }: Readonly<RequiresChildren>) {
  const showMessageTeaser = useMessageTeaser();
  const placeholderMatrixClient = createClient({
    baseUrl: "",
  });
  const matrixClient = useRef(placeholderMatrixClient);

  const [clientState, setClientState] = useState<ClientState>(
    ClientState.CreateMatrixClient,
  );
  const { data: departmentInfo } = useGetDepartment();

  const isClientPrepared = clientState === ClientState.Ready;

  useIdleTimerHook(matrixClient, setClientState);
  useChatLifecycle(matrixClient, clientState, setClientState);

  // Handle chat message teaser
  useEffect(() => {
    if (!isClientPrepared) return;
    const currentMatrixClient = matrixClient.current;

    async function onMessage({
      event,
      room,
    }: Pick<RoomEventDetails, "event" | "room">): Promise<void> {
      if (event.isEncrypted()) {
        await currentMatrixClient.decryptEventIfNeeded(event);
      }
      const messageContent = event.getContent();
      if (!isMessageTypeWithBody(messageContent)) return;

      const { roomId } = room;
      const sender = currentMatrixClient.getUser(event.getSender() ?? "");
      const communicationType = getRoomCommunicationType(
        matrixClient.current,
        room,
      );

      if (
        shouldShowMessageTeaser({
          sender,
          loggedInUser: currentMatrixClient.getUserId(),
          timestamp: event.getDate(),
        }) &&
        sender?.displayName
      ) {
        showMessageTeaser({
          title: room.name,
          text: isGroupRoom(communicationType)
            ? `${sender.displayName}: ${messageContent.body}`
            : messageContent.body,
          link: routes.chatRoom(roomId),
          userPresence: isGroupRoom(communicationType)
            ? ""
            : sender.presence.toString(),
        });
      }
    }

    function onRoomTimeline(
      event: MatrixEvent,
      room: Room | undefined,
      _: boolean | undefined,
      removed: boolean,
    ) {
      if (!room || removed) return;
      void onMessage({ event, room });
    }

    currentMatrixClient.on(RoomEvent.Timeline, onRoomTimeline);

    return () => {
      currentMatrixClient.removeListener(RoomEvent.Timeline, onRoomTimeline);
    };
  }, [isClientPrepared, showMessageTeaser]);

  /**
   * It notifies the user when they're not on the chat page
   * that they need to complete the encryption process to use the chat.
   */
  useEffect(() => {
    if (
      clientState === ClientState.CreateKeyBackup ||
      clientState === ClientState.RestoreKeyBackup
    ) {
      showMessageTeaser({
        title: "Chat",
        text:
          clientState === ClientState.CreateKeyBackup
            ? "Richten Sie ein Sicherheitsbackup ein um die Chatfunktion zu nutzen"
            : "Bestätigen sie dieses Endgerät um die Chatfunktion zu nutzen",
        type: "info",
      });
    }
  }, [clientState, showMessageTeaser]);

  /**
   * Automatically join rooms when invited
   */
  useEffect(() => {
    if (!isClientPrepared) return;
    const currentMatrixClient = matrixClient.current;

    function onMyMembership(room: Room, membership: Membership) {
      if (membership === KnownMembership.Invite.toString()) {
        currentMatrixClient.joinRoom(room.roomId).catch((e) => {
          logger.error("Joining room failed", e);
        });
      }
    }

    currentMatrixClient.on(RoomEvent.MyMembership, onMyMembership);

    return () => {
      currentMatrixClient.removeListener(
        RoomEvent.MyMembership,
        onMyMembership,
      );
    };
  }, [isClientPrepared]);

  const contextValues = useMemo<ChatClientContextType>(
    () => ({
      clientState,
      setClientState,
      matrixClient: matrixClient.current,
      departmentInfo,
      isClientPrepared: isClientPrepared,
    }),
    [clientState, departmentInfo, isClientPrepared],
  );

  return (
    <ChatClientContext value={contextValues}>{children}</ChatClientContext>
  );
}

export function useChatClientContext() {
  const chatContext = useContext(ChatClientContext);
  if (isNullish(chatContext)) {
    throw new Error("useChatContext was called outside ChatContextProvider");
  }
  return chatContext;
}

export { ChatClientContext as ChatContext, ChatClientProvider as ChatProvider };
