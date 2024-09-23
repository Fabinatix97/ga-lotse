/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DraftsIcon from "@mui/icons-material/Drafts";
import { Stack, Typography } from "@mui/joy";

import { MessageNotification } from "@/lib/baseModule/components/layout/messagesSidebar/MessageNotification";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useNewMessages } from "@/lib/businessModules/chat/shared/hooks/useNewMessages";

function NoMessagesInfo() {
  return (
    <Stack gap={3} alignItems={"center"}>
      <DraftsIcon
        sx={{
          marginTop: { xxs: 5, sm: 10 },
          fontSize: { xxs: 80, sm: 128 },
        }}
      />
      <Typography level="h4" component="h2">
        Aktuell nichts Neues
      </Typography>
    </Stack>
  );
}

export function MessagesSidebarContent() {
  const { userSettings } = useChat();
  const { newMessages } = useNewMessages();

  if (!userSettings.chatUsageEnabled) {
    return <ChatNoAccessAlert />;
  }

  if (!newMessages.length) {
    return <NoMessagesInfo />;
  }
  return (
    <Stack sx={{ marginTop: 3 }} gap={2}>
      {newMessages.map((notification) => (
        <MessageNotification
          key={notification.id}
          message={notification}
          sender={notification.sender}
        />
      ))}
    </Stack>
  );
}
