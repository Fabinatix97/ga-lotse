/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  MatrixClient,
  MatrixEvent,
  MatrixEventEvent,
  Room,
  RoomEvent,
  createClient,
} from "matrix-js-sdk/lib/matrix";
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
import { isNullish, omit } from "remeda";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { useChatLifecycle } from "@/lib/businessModules/chat/shared/hooks/useChatLifecycle";
import { usePresence } from "@/lib/businessModules/chat/shared/hooks/usePresence";
import { routes } from "@/lib/businessModules/chat/shared/routes";
import {
  RoomEventDetails,
  UsersPresence,
  isMessageTypeWithBody,
} from "@/lib/businessModules/chat/shared/types";
import { shouldShowMessageTeaser } from "@/lib/businessModules/chat/shared/utils";
import { useMessageTeaser } from "@/lib/shared/components/chat/MessageTeaserProvider";

export interface ChatClientContextType {
  matrixClient: MatrixClient;
  clientState: ClientState;
  setClientState: Dispatch<SetStateAction<ClientState>>;
  unreadNotificationsPerRoom: Record<string, number>;
  usersPresence: UsersPresence;
}

export const ChatClientContext = createContext<ChatClientContextType | null>(
  null,
);

export function ChatClientProvider({ children }: Readonly<RequiresChildren>) {
  const showMessageTeaser = useMessageTeaser();
  const { configuration } = useChat();
  const baseUrl = configuration.MATRIX_SERVER_URL;

  const matrixClient = useRef<MatrixClient>(createClient({ baseUrl }));

  const [clientState, setClientState] = useState<ClientState>(ClientState.Idle);
  const [unreadNotificationsPerRoom, setUnreadNotificationsPerRoom] = useState<
    Record<string, number>
  >({});

  // CHAT INIT
  useChatLifecycle(matrixClient, clientState, setClientState);

  const { usersPresence } = usePresence(matrixClient.current, clientState);

  // Handle unread messages notification
  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;
    const currentMatrixClient = matrixClient.current;

    function setUnreadNotification(event: MatrixEvent, room?: Room | Error) {
      let eventRoom = room instanceof Error ? undefined : room;
      let roomId = eventRoom?.roomId;
      if (!eventRoom || !roomId) {
        roomId = event?.getRoomId();
        if (!roomId) return;
        eventRoom = currentMatrixClient.getRoom(roomId) ?? undefined;
      }
      if (!eventRoom) return;

      const unreadMessages = eventRoom.getUnreadNotificationCount();
      setUnreadNotificationsPerRoom((prevState) => {
        let state = { ...prevState, [roomId]: unreadMessages };
        if (unreadMessages === 0) {
          state = omit(state, [roomId]);
        }
        return state;
      });
    }

    currentMatrixClient.on(RoomEvent.Timeline, setUnreadNotification);
    currentMatrixClient.on(RoomEvent.Receipt, setUnreadNotification);
    currentMatrixClient.on(RoomEvent.Redaction, setUnreadNotification);
    currentMatrixClient.on(MatrixEventEvent.Decrypted, setUnreadNotification);

    return () => {
      currentMatrixClient.removeListener(
        RoomEvent.Timeline,
        setUnreadNotification,
      );
      currentMatrixClient.removeListener(
        RoomEvent.Receipt,
        setUnreadNotification,
      );
      currentMatrixClient.removeListener(
        RoomEvent.Redaction,
        setUnreadNotification,
      );
      currentMatrixClient.removeListener(
        MatrixEventEvent.Decrypted,
        setUnreadNotification,
      );
    };
  }, [clientState]);

  // Handle chat message teaser
  useEffect(() => {
    if (clientState !== ClientState.Prepared) return;
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
      const guestCount = room
        .getMembers()
        .filter(
          (member) => member.userId !== currentMatrixClient.getUserId(),
        ).length;

      const sender = currentMatrixClient.getUser(event.getSender() ?? "");

      if (
        shouldShowMessageTeaser({
          sender,
          loggedInUser: currentMatrixClient.getUserId(),
          timestamp: event.getDate(),
        }) &&
        sender?.displayName
      ) {
        showMessageTeaser({
          username: room.name,
          text:
            guestCount > 1
              ? `${sender.displayName}: ${messageContent.body}`
              : messageContent.body,
          link: routes.chatRoom(roomId),
          userPresence: guestCount > 1 ? "" : sender.presence.toString(),
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
  }, [clientState, showMessageTeaser]);

  const contextValues = useMemo(
    () => ({
      clientState,
      setClientState,
      matrixClient: matrixClient.current,
      unreadNotificationsPerRoom,
      usersPresence,
    }),
    [clientState, unreadNotificationsPerRoom, usersPresence],
  );

  return (
    <ChatClientContext.Provider value={contextValues}>
      {children}
    </ChatClientContext.Provider>
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
