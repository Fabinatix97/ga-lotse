/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import CloseIcon from "@mui/icons-material/Close";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { Box, Card, IconButton, Stack, Typography } from "@mui/joy";
import { de } from "date-fns/locale";
import { Formik } from "formik";
import { User } from "matrix-js-sdk/lib/matrix";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { usePresence } from "@/lib/businessModules/chat/shared/hooks/usePresence";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { Message, Presence } from "@/lib/businessModules/chat/shared/types";
import {
  getRoomNameAndCommunicationType,
  getStatusColor,
  isDMRoom,
  markAllMessagesAsRead,
} from "@/lib/businessModules/chat/shared/utils";
import { formatDateTimeRangeToNow } from "@/lib/shared/helpers/dateTime";

export function MessageNotification({
  message,
  sender,
}: {
  message: Message;
  sender: User | null;
}) {
  const { sendMessage } = useSendMessage();
  usePresence(sender?.userId);
  const { matrixClient } = useChatClientContext();
  const room = matrixClient.getRoom(message.roomId)!;
  const { communicationType } = getRoomNameAndCommunicationType(room);
  const {
    userSettings: { sharePresence },
  } = useChat();

  return (
    <Card
      variant="plain"
      data-testid="notification"
      size="sm"
      slotProps={{
        root: {
          sx: {
            backgroundColor: "common.white",
            marginInline: 0,
            p: 0,
          },
        },
      }}
    >
      <Stack direction="row">
        <Stack width="100%" justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <Box
              display="flex"
              flexDirection="row"
              sx={{
                width: "100%",
                boxSizing: "content-box",
                alignItems: "center",
              }}
            >
              {sharePresence && isDMRoom(communicationType) && (
                <Box
                  sx={{
                    width: "0.625rem",
                    height: "0.625rem",
                    borderRadius: "100%",
                    backgroundColor: getStatusColor(
                      sender?.presence as Presence,
                    ),
                    marginRight: 0.8,
                  }}
                ></Box>
              )}
              <Typography
                level="title-md"
                sx={{
                  fontWeight: "bold",
                  height: "1.5rem",
                  maxWidth: "15rem",
                  textOverflow: "ellipsis",
                }}
              >
                {isDMRoom(communicationType)
                  ? sender?.displayName
                  : matrixClient?.getRoom(message.roomId)?.name}
              </Typography>
            </Box>
            <IconButton
              aria-label="Schließen"
              onClick={() =>
                markAllMessagesAsRead({
                  matrixClient: matrixClient,
                  roomId: message.roomId,
                })
              }
              color="primary"
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box display="flex" flexDirection="row">
            <Typography mb={0.5}>
              {isDMRoom(communicationType)
                ? message.content
                : `${sender?.displayName}: ${message.content}`}
              <Typography
                component="span"
                flexShrink={0}
                paddingLeft="4px"
                sx={{ color: "text.tertiary" }}
              >
                {message.timestamp
                  ? formatDateTimeRangeToNow(message.timestamp, { locale: de })
                  : ""}
              </Typography>
            </Typography>
          </Box>
          <Formik
            initialValues={{ messageValue: "" }}
            onSubmit={({ messageValue }) => {
              if (isNonEmptyString(messageValue)) {
                return sendMessage({
                  text: messageValue,
                  roomId: message.roomId,
                });
              }
            }}
          >
            <FormPlus>
              <InputField
                label=""
                placeholder="Antworten"
                type="text"
                name="messageValue"
                endDecorator={
                  <IconButton
                    aria-label="Schaltfläche Senden"
                    type="submit"
                    color="primary"
                  >
                    <SendOutlinedIcon />
                  </IconButton>
                }
                sx={{
                  ".MuiInput-endDecorator": {
                    paddingRight: "8px",
                  },
                  ".MuiInput-root": {
                    height: "2.75rem",
                  },
                }}
              />
            </FormPlus>
          </Formik>
        </Stack>
      </Stack>
    </Card>
  );
}
