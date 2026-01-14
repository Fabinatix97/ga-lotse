/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";
import { useContext, useMemo } from "react";

import { SidebarContent } from "@eshg/lib-employee-portal";
import { ButtonLink } from "@eshg/lib-portal";

import { MessageInformation } from "@/lib/baseModule/components/layout/messagesSidebar/MessageInformation";
import { MessageNotification } from "@/lib/baseModule/components/layout/messagesSidebar/MessageNotification";
import { NoMessagesIllustration } from "@/lib/businessModules/chat/assets/NoMessagesIllustration";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { useNewMessages } from "@/lib/businessModules/chat/shared/hooks/useNewMessages";
import { allMessagesRead } from "@/lib/businessModules/chat/shared/utils";

function NoMessagesInfo() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
      <NoMessagesIllustration sx={{ width: "400px", height: "auto" }} />
      <Typography>Keine neuen Nachrichten.</Typography>
    </Stack>
  );
}

const title = "Ungelesene Chats";

export function MessagesSidebarContent() {
  const { userSettings } = useChat();
  const { matrixClient, clientState } = useContext(ChatClientContext) ?? {};
  const { newMessages } = useNewMessages();
  const sortedMessages = useMemo(() => {
    return newMessages.toSorted((messageA, messageB) => {
      const timestampA = messageA.timestamp?.getTime() ?? 0;
      const timestampB = messageB.timestamp?.getTime() ?? 0;
      return timestampB - timestampA;
    });
  }, [newMessages]);

  if (!userSettings.chatUsageEnabled) {
    return (
      <SidebarContent title={title}>
        <ChatNoAccessAlert />
      </SidebarContent>
    );
  }

  if (
    clientState === ClientState.CreateKeyBackup ||
    clientState === ClientState.RestoreKeyBackup
  ) {
    return (
      <SidebarContent title={title}>
        <MessageInformation clientState={clientState} />
      </SidebarContent>
    );
  }

  if (!sortedMessages.length) {
    return (
      <SidebarContent title={title}>
        <NoMessagesInfo />
      </SidebarContent>
    );
  }

  return (
    <SidebarContent
      title={title}
      header={
        <>
          <ButtonLink
            level="title-md"
            onClick={() => {
              if (matrixClient) {
                allMessagesRead(matrixClient, sortedMessages);
              }
            }}
          >
            Alle als gelesen markieren
          </ButtonLink>
          <Divider
            sx={{
              marginInline: -3,
              marginTop: 4,
              marginBottom: -3,
            }}
          />
        </>
      }
    >
      <Stack
        gap={5}
        sx={{
          paddingBottom: -3,
          paddingTop: 3,
          marginBottom: 3,
        }}
      >
        {sortedMessages.map((notification) => (
          <MessageNotification
            key={notification.id}
            message={notification}
            sender={notification.sender}
          />
        ))}
      </Stack>
    </SidebarContent>
  );
}
