/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { Avatar, ListItem } from "@mui/joy";

import { BadgeAvatar } from "@/lib/businessModules/chat/components/BadgeAvatar";
import { ChatBubble } from "@/lib/businessModules/chat/components/ChatBubble";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useChatUtils } from "@/lib/businessModules/chat/shared/hooks/useChatUtils";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
import { Message } from "@/lib/businessModules/chat/shared/types";
import { formatUserReceipts } from "@/lib/businessModules/chat/shared/utils";

interface MessagesListProps {
  selectedRoomId: string;
  messages: Message[];
}
export function MessagesList({
  selectedRoomId,
  messages,
}: Readonly<MessagesListProps>) {
  const {
    userSettings: { sharePresence, showReadConfirmation },
  } = useChat();
  const { matrixClient, usersPresence } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const { readConfirmationsPerRoom } =
    useReadConfirmation(showReadConfirmation);
  const confirmationsArr = formatUserReceipts(
    readConfirmationsPerRoom[selectedRoomId],
  );
  const { getImageUrl, getUser } = useChatUtils();

  if (!loggedInUserId) {
    return (
      <Alert
        title="Selected Room not found"
        message="Unknown error occured"
        color="danger"
      />
    );
  }

  return (
    <>
      {messages.map((message: Message) => {
        const isYou = message.sender?.userId === loggedInUserId;
        const presenceStatus = message.sender?.userId
          ? usersPresence[message.sender.userId]
          : undefined;
        const confirmationIds = confirmationsArr?.[message.id];

        const receiptUsers =
          showReadConfirmation && Array.isArray(confirmationIds)
            ? confirmationIds.map((userId) => getUser(userId))
            : [];

        return (
          <ListItem
            key={message.id}
            sx={{ flexDirection: isYou ? "row-reverse" : "row", px: 0, py: 1 }}
          >
            <BadgeAvatar status={sharePresence ? presenceStatus : undefined}>
              <Avatar
                src={getImageUrl(message.sender?.avatarUrl) ?? undefined}
                variant="outlined"
                sx={{ ...(isYou ? { ml: 2 } : { mr: 2 }) }}
              />
            </BadgeAvatar>
            <ChatBubble
              variant={isYou ? "sent" : "received"}
              loggedInUserId={loggedInUserId}
              message={message}
              receiptUsers={receiptUsers.filter(
                (user) => user?.userId !== loggedInUserId,
              )}
              getImageUrl={getImageUrl}
            />
          </ListItem>
        );
      })}
    </>
  );
}
