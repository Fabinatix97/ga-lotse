/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack, Typography } from "@mui/joy";

import { MessageNotification } from "@/lib/baseModule/components/layout/messagesSidebar/MessageNotification";
import { NoMessagesIllustration } from "@/lib/businessModules/chat/assets/NoMessagesIllustration";
import { ChatNoAccessAlert } from "@/lib/businessModules/chat/components/ChatNoAccessAlert";
import { GhostButton } from "@/lib/businessModules/chat/components/GhostButton";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useMatrixClient } from "@/lib/businessModules/chat/shared/hooks/useMatrixClient";
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

export function MessagesSidebarContent() {
  const { userSettings } = useChat();
  const { newMessages } = useNewMessages();
  const matrixClient = useMatrixClient();

  if (!userSettings.chatUsageEnabled) {
    return <ChatNoAccessAlert />;
  }

  if (!newMessages.length) {
    return <NoMessagesInfo />;
  }
  return (
    <Stack>
      <GhostButton
        onClick={() => {
          if (matrixClient) {
            allMessagesRead(matrixClient, newMessages);
          }
        }}
      >
        Alle als gelesen markieren
      </GhostButton>
      <Divider sx={{ marginBottom: 3, marginInline: -3, marginTop: 4 }} />
      <Stack gap={5} sx={{ paddingBottom: -3 }}>
        {newMessages.map((notification) => (
          <MessageNotification
            key={notification.id}
            message={notification}
            sender={notification.sender}
          />
        ))}
      </Stack>
    </Stack>
  );
}
