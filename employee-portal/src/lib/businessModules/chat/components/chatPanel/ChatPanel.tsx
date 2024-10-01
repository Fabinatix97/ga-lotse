/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert, AlertProps } from "@eshg/lib-portal/components/Alert";
import { Box } from "@mui/joy";
import { useEffect, useState } from "react";
import { isNonNullish } from "remeda";

import { chatColumnHeaderHeight } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { ChatMessages } from "@/lib/businessModules/chat/components/chatPanel/ChatMessages";
import { ChatPanelHeader } from "@/lib/businessModules/chat/components/chatPanel/ChatPanelHeader";
import { MessageInput } from "@/lib/businessModules/chat/components/chatPanel/MessageInput";
import { NewDirectChat } from "@/lib/businessModules/chat/components/chatPanel/NewDirectChat";
import { NewGroupChat } from "@/lib/businessModules/chat/components/chatPanel/NewGroupChat";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useRoomMessages } from "@/lib/businessModules/chat/shared/hooks/useRoomMessages";
import { useTyping } from "@/lib/businessModules/chat/shared/hooks/useTyping";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";
import {
  extractHomeserverNameFromUserMatrixID,
  getDepartmentNameFromUserId,
  getRoomNameAndCommunicationType,
} from "@/lib/businessModules/chat/shared/utils";
import { sidebarPadding } from "@/lib/shared/components/sidebar/Sidebar";

export interface ChatPanelProps {
  roomId: string | null;
  isOpenChatSettings: boolean;
  toggleChatSettingsView(): void;
  chatPanelView: ChatPanelView;
  setChatPanelView: (viewType: ChatPanelView) => void;
}

export function ChatPanel({
  roomId,
  toggleChatSettingsView,
  chatPanelView,
  setChatPanelView,
}: Readonly<ChatPanelProps>) {
  const {
    userSettings: { showTypingNotification },
  } = useChat();
  const { handleUserTyping } = useTyping(showTypingNotification);
  const { handleSendMessage, messages } = useRoomMessages();
  const [userList, setUserList] = useState<
    (ApiUser & { department?: string })[] | undefined
  >();
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const [alert, setAlert] = useState<AlertProps>();
  const selectedRoom = matrixClient.getRoom(roomId ?? undefined);
  const roomWithCommunicationType = selectedRoom
    ? getRoomNameAndCommunicationType(selectedRoom)
    : undefined;

  useEffect(() => {
    async function getUsers() {
      try {
        const data = await matrixClient.searchUserDirectory({
          term: extractHomeserverNameFromUserMatrixID(loggedInUserId),
        });
        if (data.results.length) {
          const users = data.results.filter(
            (user) =>
              !!user && user.user_id !== loggedInUserId && !!user.display_name,
          );
          const usersWithDepartment = await Promise.all(
            users.map(async (user) => {
              const userInfo = await matrixClient.whoami();
              const department = getDepartmentNameFromUserId(
                userInfo.user_id,
              )?.organisationName;
              return {
                ...user,
                department,
              };
            }),
          );
          setUserList(usersWithDepartment);
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
  }, [chatPanelView, loggedInUserId, matrixClient]);

  if (isNonNullish(alert)) {
    return (
      <Box sx={{ paddingRight: sidebarPadding, paddingLeft: sidebarPadding }}>
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
        <ChatPanelHeader
          roomId={roomId}
          toggleChatSettingsView={toggleChatSettingsView}
        />
        <Box
          sx={{
            height: `calc(100% - ${chatColumnHeaderHeight})`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatMessages room={roomWithCommunicationType} messages={messages} />
          <MessageInput
            handleUserTyping={handleUserTyping}
            selectedRoomId={roomId}
            sendMessage={handleSendMessage}
            roomMembers={roomWithCommunicationType.room.getMembers()}
          />
        </Box>
      </>
    );
  } else {
    return <ChatIllustrationBackground />;
  }
}
