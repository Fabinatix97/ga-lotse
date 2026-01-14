/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { RoomMember } from "matrix-js-sdk";

import { FormPlus } from "@eshg/lib-portal";

import { TextareaComponent } from "@/lib/businessModules/chat/components/chatPanel/TextareaComponent";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export interface MessageFormValues {
  message: string;
  mentionedUsers?: string[];
}
export function validateMessageForm(
  values: MessageFormValues,
): FormikErrors<MessageFormValues> {
  const errors: FormikErrors<MessageFormValues> = {};
  if (!values.message || values.message.trim().length === 0) {
    errors.message = "Gib etwas ein, um das Gespräch zu beginnen!";
  }

  return errors;
}
interface MessageInput {
  handleUserTyping?: (roomId: string, isTyping: boolean) => Promise<void>;
  selectedRoomId?: string;
  sendMessage: (text: string, mentionedUser?: string[]) => Promise<void> | null;
  roomMembers: RoomMember[];
  disabled?: boolean;
  isRoomDeactivated?: boolean;
}

export function MessageInput({
  sendMessage,
  roomMembers,
  handleUserTyping,
  selectedRoomId,
  disabled,
  isRoomDeactivated,
}: Readonly<MessageInput>) {
  return (
    <Box>
      <Formik<MessageFormValues>
        initialValues={{ message: "", mentionedUsers: undefined }}
        validate={validateMessageForm}
        onSubmit={async (values, helpers) => {
          try {
            await sendMessage(values.message, values.mentionedUsers);
            helpers.resetForm();
          } catch (error) {
            logger.warn("Sending message failed", error);
          }
        }}
      >
        <FormPlus aria-label="Neue Nachricht">
          <TextareaComponent
            name="message"
            selectFieldName="mentionedUsers"
            handleUserTyping={handleUserTyping}
            selectedRoomId={selectedRoomId}
            roomMembers={roomMembers}
            disabled={disabled ?? isRoomDeactivated}
          />
        </FormPlus>
      </Formik>
    </Box>
  );
}
