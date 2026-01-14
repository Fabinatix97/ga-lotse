/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  IconButton,
  Sheet,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { Formik } from "formik";
import { RoomMember } from "matrix-js-sdk";
import { useEffect, useRef, useState } from "react";

import { BaseModal, FormPlus } from "@eshg/lib-portal";

import { splitMessageWithNames } from "@/lib/businessModules/chat/components/chatPanel/ChatBubble";
import { DeletedMessage } from "@/lib/businessModules/chat/components/chatPanel/DeletedMessage";
import {
  MessageFormValues,
  validateMessageForm,
} from "@/lib/businessModules/chat/components/chatPanel/MessageInput";
import { TextareaComponent } from "@/lib/businessModules/chat/components/chatPanel/TextareaComponent";
import { UndecipheredMessage } from "@/lib/businessModules/chat/components/chatPanel/UndecipheredMessage";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import {
  CommunicationType,
  InfoPanelView,
} from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import {
  MentionedMember,
  Message,
} from "@/lib/businessModules/chat/shared/types";

interface ChatBubbleProps {
  message: Message;
  variant: "sent" | "received";
  mentions: MentionedMember[];
  loggedInUserId: string;
  communicationType: CommunicationType;
  removeMessage: (messageId: string) => Promise<void>;
  editMessage: (text: string, mentionedUsers?: string[]) => Promise<void>;
  roomMembers: RoomMember[];
  roomId: string;
}

export function MessageContentMobile({
  variant,
  message,
  mentions,
  loggedInUserId,
  communicationType,
  removeMessage,
  editMessage,
  roomMembers,
  roomId,
}: Readonly<ChatBubbleProps>) {
  const { setInfoPanelView } = useInfoPanelContext();
  const isSent = variant === "sent";
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editFieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    const length = message.content.length;
    const innerTextareaElement = editFieldRef.current?.firstChild;
    if (innerTextareaElement instanceof HTMLTextAreaElement) {
      innerTextareaElement.setSelectionRange(length, length);
    }
  }, [isEditing, message.content.length]);

  if (message.decrypted) {
    return <UndecipheredMessage isSent={isSent} />;
  }

  if (message.removed) {
    return <DeletedMessage isSent={isSent} />;
  }

  return (
    <>
      <Sheet
        color={isSent ? "primary" : "neutral"}
        variant={isSent ? "solid" : "soft"}
        sx={{
          p: 0,
          borderRadius: "md",
          backgroundColor: isSent ? "primary.500" : "neutral.100",
          wordBreak: "break-word",
          marginLeft: 0,
          marginRight: 0,
          width: "100%",
        }}
      >
        {isEditing ? (
          <Box
            sx={{
              backgroundColor: "white",
              width: "100%",
            }}
          >
            <Formik<MessageFormValues>
              initialValues={{
                message: message.content,
                mentionedUsers: mentions.map((user) => user.userId),
              }}
              validate={validateMessageForm}
              onSubmit={async (values, helpers) => {
                try {
                  await editMessage(values.message, values.mentionedUsers);
                  helpers.resetForm();
                  setIsEditing(false);
                } catch (error) {
                  logger.warn("Sending message failed", error);
                }
              }}
            >
              <FormPlus>
                <TextareaComponent
                  ref={editFieldRef}
                  name="message"
                  selectFieldName="mentionedUsers"
                  roomMembers={roomMembers}
                  selectedRoomId={roomId}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    px: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="sm"
                    sx={{ mr: 1 }}
                    type="cancel"
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button size="sm" type="submit">
                    Bearbeiten
                  </Button>
                </Box>
              </FormPlus>
            </Formik>
          </Box>
        ) : (
          <>
            {communicationType === CommunicationType.PublicRoom && (
              <Typography level="title-sm" sx={{ marginBottom: "0.25rem" }}>
                {message.sender?.userId === loggedInUserId
                  ? ""
                  : message.sender?.displayName}
              </Typography>
            )}
            <Tooltip
              disableHoverListener={!isSent}
              disableTouchListener={!isSent}
              placement="top-end"
              disablePortal
              leaveDelay={200}
              modifiers={[{ name: "offset", options: { offset: [0, 0] } }]}
              sx={{
                backgroundColor: "white",
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: (theme) => theme.radius.sm,
                "&.MuiTooltip-root": {
                  padding: 0.25,
                },
                display: "flex",
                gap: 0.5,
              }}
              title={
                <>
                  <IconButton
                    size="sm"
                    variant="plain"
                    aria-label="Bearbeiten"
                    onClick={() => setIsEditing(true)}
                  >
                    <EditIcon sx={{ color: "neutral.500" }} />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="plain"
                    aria-label="Löschen"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    <DeleteOutlineIcon sx={{ color: "neutral.500" }} />
                  </IconButton>
                </>
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
                        (userId: string) =>
                          setInfoPanelView(InfoPanelView.UserInfo, userId),
                        isSent,
                      )
                    : message.content}
                </Typography>
              </Sheet>
            </Tooltip>
          </>
        )}
      </Sheet>
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
