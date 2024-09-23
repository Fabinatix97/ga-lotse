/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Card, IconButton, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { User } from "matrix-js-sdk/lib/matrix";

import { BadgeAvatar } from "@/lib/businessModules/chat/components/BadgeAvatar";
import { useGetUsersPresence } from "@/lib/businessModules/chat/shared/hooks/useGetUsersPresence";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { Message } from "@/lib/businessModules/chat/shared/types";
import { formatDateTimeRangeToNow } from "@/lib/shared/helpers/dateTime";

export function MessageNotification({
  message,
  sender,
}: {
  message: Message;
  sender: User | null;
}) {
  const { sendMessage } = useSendMessage();
  const usersPresence = useGetUsersPresence();

  return (
    <Card variant="soft" data-testid="notification" size="sm">
      <Stack direction="row" spacing={1}>
        <Stack direction="row" alignItems="start">
          <BadgeAvatar status={usersPresence[sender?.userId ?? ""]}>
            <Avatar src={sender?.avatarUrl} />
          </BadgeAvatar>
        </Stack>
        <Stack width="100%">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Typography level="body-md" fontWeight={600}>
              {sender?.displayName}
            </Typography>
            <Typography level="body-xs" color="neutral" flexShrink={0}>
              {message.timestamp
                ? formatDateTimeRangeToNow(message.timestamp)
                : ""}
            </Typography>
          </Stack>
          <Typography mb={0.5}>{message.content}</Typography>
          <Formik
            initialValues={{ messageValue: "" }}
            onSubmit={({ messageValue }) => {
              if (isNonEmptyString(messageValue)) {
                return sendMessage(messageValue, message.roomId);
              }
            }}
          >
            <FormPlus>
              <InputField
                label=""
                type="text"
                name="messageValue"
                endDecorator={
                  <IconButton aria-label="Schaltfläche Senden" type="submit">
                    <SendIcon />
                  </IconButton>
                }
                sx={{
                  "& input": {
                    width: "100%",
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
