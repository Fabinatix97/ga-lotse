/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Box, Button, Stack, Typography, useTheme } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { ChatInputField } from "@/lib/businessModules/chat/components/ChatInputField";
import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import { InputComponent } from "@/lib/businessModules/chat/components/chatPanel/InputComponent";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";

export interface DirectChatFormValues {
  invite: string[];
  chatName: string;
  message: string;
}

interface NewGroupChatProps {
  cancel: () => void;
  userList: (ApiUser & { department?: string })[] | undefined;
  setChatPanelView: (viewType: ChatPanelView) => void;
}
export function NewGroupChat({
  cancel,
  userList,
  setChatPanelView,
}: Readonly<NewGroupChatProps>) {
  const { createNewChatRoom } = useCreateNewChat();
  const { sendMessage } = useSendMessage();
  const theme = useTheme();
  const { setRoomIdParam } = useChatSearchParams();
  const snackbar = useSnackbar();

  async function handleStartGroupChat(values: DirectChatFormValues) {
    try {
      const newRoomId = await createNewChatRoom({
        invite: values.invite,
        name: values.chatName,
      });
      if (!newRoomId) {
        return;
      }
      await sendMessage(values.message, newRoomId);
      setRoomIdParam(newRoomId);
      setChatPanelView(ChatPanelView.ChatMessages);
    } catch {
      snackbar.error("Chat konnte nicht erstellt werden");
    }
  }
  function validateGroupForm(
    values: DirectChatFormValues,
  ): FormikErrors<DirectChatFormValues> {
    const errors: FormikErrors<DirectChatFormValues> = {};
    if (values.invite?.length === 0) {
      errors.invite = "Bitte wählen Sie mindestens einen Benutzer aus.";
    }
    if (!values.chatName || values.chatName === "") {
      errors.chatName = "Bitte fügen Sie den Chatnamen hinzu";
    }
    if (!values.message || values.message === "") {
      errors.message = "Gib etwas ein, um das Gespräch zu beginnen!";
    }

    return errors;
  }

  return (
    <Box sx={{ height: "100%" }}>
      <Formik<DirectChatFormValues>
        initialValues={{ invite: [], chatName: "", message: "" }}
        onSubmit={handleStartGroupChat}
        validate={validateGroupForm}
      >
        <FormPlus
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              padding: 2,
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
              <Typography level="h3">Gruppenchat erstellen</Typography>
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
              multiple={true}
            />
            <ChatInputField
              type="text"
              name="chatName"
              placeholder="Gruppenchat benennen"
              label=""
              aria-label="Chat name"
              sx={{
                "--FormLabel-margin": 0,
                marginTop: 0,
                ".MuiInput-root": {
                  height: "3.25rem",
                },
              }}
            />
          </Box>
          <ChatIllustrationBackground />
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
