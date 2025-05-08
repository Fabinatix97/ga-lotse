/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { isNonNullish, isShallowEqual, isStrictEqual } from "remeda";

import { SIDEBAR_PADDING } from "@eshg/lib-employee-portal";
import { Alert, AlertProps } from "@eshg/lib-portal/components/Alert";

import { chatColumnHeaderHeight } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { ChatMessages } from "@/lib/businessModules/chat/components/chatPanel/ChatMessages";
import { ChatPanelHeader } from "@/lib/businessModules/chat/components/chatPanel/ChatPanelHeader";
import { MessageInput } from "@/lib/businessModules/chat/components/chatPanel/MessageInput";
import { NewDirectChat } from "@/lib/businessModules/chat/components/chatPanel/NewDirectChat";
import { NewGroupChat } from "@/lib/businessModules/chat/components/chatPanel/NewGroupChat";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import {
  ChatPanelView,
  CommunicationType,
} from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { useTyping } from "@/lib/businessModules/chat/shared/hooks/useTyping";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";
import {
  checkIfRoomIsInactive,
  getChatUserDirectory,
  getDMRooms,
  getRoomNameAndCommunicationType,
  markAllMessagesAsRead,
  setReadMarker,
} from "@/lib/businessModules/chat/shared/utils";
import { useWindowFocus } from "@/lib/shared/hooks/useWindowFocus";

interface ChatPanelProps {
  roomId: string | null;
  chatPanelView: ChatPanelView;
  setChatPanelView: (viewType: ChatPanelView) => void;
}

export function ChatPanel({
  roomId,
  chatPanelView,
  setChatPanelView,
}: Readonly<ChatPanelProps>) {
  const {
    userSettings: { showTypingNotification, showReadConfirmation },
  } = useChat();
  const isFocused = useWindowFocus();
  const { handleUserTyping } = useTyping(showTypingNotification);
  const { sendMessage } = useSendMessage();
  const [userList, setUserList] = useState<
    (ApiUser & { department?: string })[] | undefined
  >();
  const { matrixClient, departmentInfo } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const [alert, setAlert] = useState<AlertProps>();
  const selectedRoom = matrixClient.getRoom(roomId ?? undefined);
  const roomWithCommunicationType = selectedRoom
    ? getRoomNameAndCommunicationType(matrixClient, selectedRoom)
    : undefined;
  const directMessageRooms = getDMRooms(matrixClient, matrixClient.getUserId());
  const wasDMRoom = roomId && directMessageRooms?.includes(roomId);
  const isRoomDeactivated = checkIfRoomIsInactive(
    loggedInUserId,
    roomWithCommunicationType
      ? {
          ...roomWithCommunicationType,
          communicationType: wasDMRoom
            ? CommunicationType.DirectMessage
            : roomWithCommunicationType.communicationType,
        }
      : undefined,
  );

  useEffect(() => {
    if (!isFocused) return;
    if (!roomId) return;
    if (!showReadConfirmation) {
      void setReadMarker({
        roomId,
        matrixClient,
      });
      return;
    }
    void markAllMessagesAsRead({
      roomId,
      matrixClient,
    });
  }, [isFocused, matrixClient, roomId, showReadConfirmation]);

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await getChatUserDirectory(matrixClient);
        if (data.results.length) {
          const users = data.results
            .filter((user) => {
              const isLoggedInUser = isStrictEqual(
                user.user_id,
                loggedInUserId,
              );

              const isAdmin = isShallowEqual(
                user.display_name?.toUpperCase(),
                "ADMIN",
              );

              return (
                isNonNullish(user.display_name) && !isLoggedInUser && !isAdmin
              );
            })
            .map((u) => ({ ...u, department: departmentInfo?.name }));

          setUserList(users);
          setAlert(undefined);
        }
      } catch (error) {
        setAlert({
          title: "Es hat nicht funktioniert, die Benutzer abzurufen.",
          color: "danger",
        });
        logger.warn("Search user directory failed", error);
      }
    }
    if (
      chatPanelView === ChatPanelView.NewDirectChat ||
      chatPanelView === ChatPanelView.NewGroupChat
    ) {
      void getUsers();
    }
  }, [chatPanelView, departmentInfo?.name, loggedInUserId, matrixClient]);

  if (isNonNullish(alert)) {
    return (
      <Box sx={{ paddingRight: SIDEBAR_PADDING, paddingLeft: SIDEBAR_PADDING }}>
        <Alert {...alert} color="danger" />
      </Box>
    );
  }
  if (chatPanelView === ChatPanelView.NoChatSelected) {
    return <ChatIllustrationBackground />;
  }
  if (chatPanelView === ChatPanelView.NewDirectChat) {
    return (
      <NewDirectChat
        cancel={() => setChatPanelView(ChatPanelView.NoChatSelected)}
        userList={userList}
        setChatPanelView={setChatPanelView}
      />
    );
  }
  if (chatPanelView === ChatPanelView.NewGroupChat) {
    return (
      <NewGroupChat
        cancel={() => setChatPanelView(ChatPanelView.NoChatSelected)}
        userList={userList}
        setChatPanelView={setChatPanelView}
      />
    );
  }
  if (roomId && roomWithCommunicationType) {
    return (
      <>
        <ChatPanelHeader roomId={roomId} />
        <Box
          sx={{
            height: `calc(100% - ${chatColumnHeaderHeight})`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatMessages
            key={selectedRoom?.roomId}
            room={roomWithCommunicationType}
          />
          <MessageInput
            handleUserTyping={handleUserTyping}
            selectedRoomId={roomId}
            sendMessage={(text, mentionedUsers) =>
              sendMessage({ text, mentionedUsers, roomId })
            }
            roomMembers={roomWithCommunicationType.room.getMembers()}
            isRoomDeactivated={isRoomDeactivated}
          />
        </Box>
      </>
    );
  } else {
    return <ChatIllustrationBackground />;
  }
}
