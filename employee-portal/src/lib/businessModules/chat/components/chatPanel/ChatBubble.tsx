/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  IconButton,
  Sheet,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { ReactNode, useState } from "react";
import { isEmpty } from "remeda";

import { BaseModal, ButtonLink } from "@eshg/lib-portal";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { DeletedMessage } from "@/lib/businessModules/chat/components/chatPanel/DeletedMessage";
import { ReadingReceipt } from "@/lib/businessModules/chat/components/chatPanel/ReadingReceipt";
import { UndecipheredMessage } from "@/lib/businessModules/chat/components/chatPanel/UndecipheredMessage";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";
import {
  MentionedMember,
  Message,
} from "@/lib/businessModules/chat/shared/types";
import {
  formatChatDate,
  removeAtFromUsernames,
} from "@/lib/businessModules/chat/shared/utils";

interface ChatBubbleProps {
  message: Message;
  variant: "sent" | "received";
  loggedInUserId: string;
  lastReadMessageIndexes: number[];
  index: number;
  mentions: MentionedMember[];
  removeMessage: (messageId: string) => Promise<void>;
}

export function ChatBubble({
  variant,
  message,
  loggedInUserId,
  lastReadMessageIndexes = [],
  index,
  mentions,
  removeMessage,
}: Readonly<ChatBubbleProps>) {
  const { userSettings } = useChat();
  const { setInfoPanelView } = useInfoPanelContext();
  const isSent = variant === "sent";
  const hasNoReceipts = isEmpty(lastReadMessageIndexes);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Messages are sorted from newest to oldest.
  // Here, we compare the index to check if it is greater than the last read index.
  // This means that the message is older than the read ones, so it must have been read.
  const isMessageRead = lastReadMessageIndexes.some(
    (readIndex) => index >= readIndex,
  );

  function handleMentionClick(userId: string) {
    setInfoPanelView(InfoPanelView.UserInfo, userId);
  }

  let content = (
    <Tooltip
      disableHoverListener={!isSent}
      placement="top-end"
      disablePortal
      leaveDelay={500}
      modifiers={[{ name: "offset", options: { offset: [0, 5] } }]}
      sx={{
        backgroundColor: "white",
        "&.MuiTooltip-root": {
          padding: 0,
        },
      }}
      title={
        <IconButton
          size="sm"
          variant="outlined"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          <DeleteOutlineIcon sx={{ color: "neutral.500" }} />
        </IconButton>
      }
    >
      <Sheet
        color={isSent ? "primary" : "neutral"}
        variant={isSent ? "solid" : "soft"}
        sx={{
          p: 1,
          borderRadius: "md",
          backgroundColor: isSent ? "primary.500" : "neutral.100",
          wordBreak: "break-word",
          marginLeft: 1,
          marginRight: 1,
        }}
      >
        <Typography
          component="div"
          level="body-md"
          sx={{
            color: isSent ? "background.body" : "text.primary",
            overflowWrap: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          {mentions.length
            ? splitMessageWithNames(
                message,
                mentions,
                handleMentionClick,
                isSent,
              )
            : message.content}
        </Typography>
      </Sheet>
    </Tooltip>
  );

  if (message.decrypted) {
    content = <UndecipheredMessage isSent={isSent} />;
  }

  if (message.removed) {
    content = <DeletedMessage isSent={isSent} />;
  }

  return (
    <>
      <Stack direction="column" alignItems="flex-start">
        <Stack
          direction="row"
          justifyContent={
            message.sender?.userId === loggedInUserId ? "end" : "start"
          }
          spacing={1}
          sx={{ mb: 0.25 }}
          width="100%"
        >
          <Typography textColor="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {message.sender?.userId === loggedInUserId
              ? ""
              : message.sender?.displayName}
          </Typography>
          {message.timestamp && (
            <Typography
              textColor="text.secondary"
              sx={{ fontSize: "0.875rem" }}
              data-testid="message-timestamp"
            >
              {formatChatDate(message.timestamp)}
            </Typography>
          )}
        </Stack>
        <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
          {!isSent && (
            <ChatAvatar
              name={message.sender?.displayName}
              userId={message.sender?.userId}
              avatarUrl={message.sender?.avatarUrl ?? null}
            />
          )}

          {content}

          {isSent && (
            <ReadingReceipt
              isReadReceiptEnabled={userSettings.showReadConfirmation}
              isRead={hasNoReceipts ? false : isMessageRead}
              isSent={message.sent}
            />
          )}
        </Box>
      </Stack>
      <BaseModal
        modalTitle="Sind Sie sicher?"
        color="danger"
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <>
          <Typography>
            Wenn Sie auf Löschen klicken, wird diese Nachricht bei Ihnen und
            allen anderen Nutzern endgültig gelöscht!
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{ marginLeft: "auto", paddingTop: 2 }}
          >
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={() => setIsModalOpen(false)}
            >
              Abbrechen
            </Button>
            <Button
              size="sm"
              color="danger"
              loadingPosition="start"
              onClick={async () => {
                await removeMessage(message.id);
                setIsModalOpen(false);
              }}
            >
              Löschen
            </Button>
          </Stack>
        </>
      </BaseModal>
    </>
  );
}

function splitMessageWithNames(
  message: Message,
  mentions: MentionedMember[],
  onClick: (userId: string) => void,
  isSent: boolean,
) {
  const contentParts: ReactNode[] = [];
  const memberIndexes: ({
    start: number;
    end: number;
  } & MentionedMember)[] = [];

  const text = removeAtFromUsernames(message.content);

  mentions.forEach((member) => {
    const match = text.match(member.name);
    if (match?.index !== undefined) {
      memberIndexes.push({
        ...member,
        start: match.index,
        end: match.index + member.name.length,
      });
    }
  });

  memberIndexes.sort((a, b) => a.start - b.start);
  memberIndexes.forEach((member, index) => {
    const prevMember = memberIndexes[index - 1];
    const prevTextStart = prevMember?.end ?? 0;
    if (member.start > 0 && !prevMember) {
      contentParts.push(text.slice(prevTextStart, member.start));
    }

    contentParts.push(
      <ButtonLink
        key={member.userId}
        level="title-md"
        textColor={isSent ? "inherit" : undefined}
        sx={{
          textDecorationColor: "inherit",
        }}
        onClick={() => onClick(member.userId)}
      >
        {member.name}
      </ButtonLink>,
    );

    const nextMember = memberIndexes[index + 1];

    if (nextMember) {
      contentParts.push(text.slice(member.end, nextMember.start));
    } else {
      contentParts.push(text.slice(member.end));
    }
  });

  return contentParts;
}
