/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { Divider, Stack, Typography } from "@mui/joy";

import { MessageNotification } from "@/lib/baseModule/components/layout/messagesSidebar/MessageNotification";
import { NoMessagesIllustration } from "@/lib/businessModules/chat/assets/NoMessagesIllustration";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useMatrixClient } from "@/lib/businessModules/chat/shared/hooks/useMatrixClient";
import { useNewMessages } from "@/lib/businessModules/chat/shared/hooks/useNewMessages";
import { allMessagesRead } from "@/lib/businessModules/chat/shared/utils";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

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
  const { newMessages } = useNewMessages();
  const matrixClient = useMatrixClient();
  if (!userSettings.chatUsageEnabled) {
    return <ChatNoAccessAlert />;
  }
  if (!newMessages.length) {
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
                allMessagesRead(matrixClient, newMessages);
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
        {newMessages.map((notification) => (
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
