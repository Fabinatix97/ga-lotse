/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { RoomMember } from "matrix-js-sdk";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";

import { InputComponent } from "@/lib/businessModules/chat/components/chatPanel/InputComponent";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export interface MessageFormValues {
  message: string;
  mentionedUsers?: string[];
}
function validateMessageForm(
  values: MessageFormValues,
): FormikErrors<MessageFormValues> {
  const errors: FormikErrors<MessageFormValues> = {};
  if (values.message?.length > 0) {
    return errors;
  }
  errors.message = "Gib etwas ein, um das Gespräch zu beginnen!";
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
        onSubmit={async (values, helpers) => {
          try {
            await sendMessage(values.message, values.mentionedUsers);
            helpers.resetForm();
          } catch (error) {
            logger.warn("Sending message failed", error);
          }
        }}
        initialValues={{ message: "", mentionedUsers: undefined }}
        validate={validateMessageForm}
      >
        <FormPlus>
          <InputComponent
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
