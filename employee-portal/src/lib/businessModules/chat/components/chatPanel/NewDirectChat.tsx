/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button, Stack, Typography, useTheme } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import { DirectChatContent } from "@/lib/businessModules/chat/components/chatPanel/DirectChatContent";
import { InputComponent } from "@/lib/businessModules/chat/components/chatPanel/InputComponent";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";
import { delayed, setDMRoom } from "@/lib/businessModules/chat/shared/utils";

export interface DirectChatFormValues {
  invite: string | null;
  message: string;
}

interface NewDirectChatProps {
  cancel: () => void;
  userList: (ApiUser & { department?: string })[] | undefined;
  setChatPanelView: (viewType: ChatPanelView) => void;
}

export function NewDirectChat({
  cancel,
  userList,
  setChatPanelView,
}: Readonly<NewDirectChatProps>) {
  const { createNewChat } = useCreateNewChat();
  const { sendMessage } = useSendMessage();
  const theme = useTheme();
  const { matrixClient } = useChatClientContext();

  const snackbar = useSnackbar();

  async function handleStartDirectMessage(values: DirectChatFormValues) {
    try {
      if (values.invite === null) return;
      const newRoomId = await createNewChat({
        invite: [values.invite],
        is_direct: true,
      });
      if (newRoomId) {
        // Sending a message with a delay allows the recipient to treat the first message as unread
        await delayed(
          () => sendMessage({ text: values.message, roomId: newRoomId }),
          100,
        );
        setChatPanelView(ChatPanelView.ChatMessages);
        // set room as direct
        await setDMRoom(matrixClient, newRoomId, matrixClient.getUserId());
      }
    } catch {
      snackbar.error("Chat konnte nicht erstellt werden");
    }
  }

  function validateDMForm(
    values: DirectChatFormValues,
  ): FormikErrors<DirectChatFormValues> {
    const errors: FormikErrors<DirectChatFormValues> = {};
    if (!values.invite || values.invite === "" || values.invite === null) {
      errors.invite = "Bitte wählen Sie mindestens einen Benutzer aus.";
    }
    if (!values.message || values.message === "") {
      errors.message = "Gib etwas ein, um das Gespräch zu beginnen!";
    }

    return errors;
  }

  return (
    <Box sx={{ height: "100%" }}>
      <Formik<DirectChatFormValues>
        initialValues={{ invite: null, message: "" }}
        onSubmit={handleStartDirectMessage}
        validate={validateDMForm}
      >
        <FormPlus
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              padding: 2,
              paddingBottom: 0,
              borderBottom: "1px solid",
              borderColor: theme.palette.neutral.outlinedBorder,
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              marginBottom={1}
              height="2.25rem"
            >
              <Typography level="h3">Neue Direktnachricht</Typography>
              <Button
                variant="soft"
                color="neutral"
                type="button"
                onClick={() => cancel()}
              >
                Abbrechen
              </Button>
            </Stack>
            <UsersAutocomplete
              name="invite"
              placeholder="Empfänger:in auswählen"
              usersList={userList ?? []}
              multiple={false}
            />
          </Box>
          <DirectChatContent />
          <InputComponent
            name="message"
            selectFieldName="mentionedUsers"
            roomMembers={[]}
          />
        </FormPlus>
      </Formik>
    </Box>
  );
}
