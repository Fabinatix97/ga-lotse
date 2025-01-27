/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Button, Stack, Typography, useTheme } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { ChatInputField } from "@/lib/businessModules/chat/components/ChatInputField";
import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import { InputComponent } from "@/lib/businessModules/chat/components/chatPanel/InputComponent";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";
import { delayed } from "@/lib/businessModules/chat/shared/utils";

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
  const { createNewChat } = useCreateNewChat();
  const { sendMessage } = useSendMessage();
  const theme = useTheme();
  const snackbar = useSnackbar();

  async function handleStartGroupChat(values: DirectChatFormValues) {
    try {
      const newRoomId = await createNewChat({
        invite: values.invite,
        name: values.chatName,
      });
      if (newRoomId) {
        // Sending a message with a delay allows the recipient to treat the first message as unread
        await delayed(
          () => sendMessage({ text: values.message, roomId: newRoomId }),
          100,
        );
        setChatPanelView(ChatPanelView.ChatMessages);
      }
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
        {({ values }) => (
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
            <Box sx={{ minHeight: "2rem" }}>
              {values.invite && values.chatName && (
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: "100%" }}
                >
                  <ChatOutlinedIcon sx={{ color: "neutral.500" }} />
                  <Typography
                    level="title-sm"
                    textColor="neutral.500"
                    fontWeight="500"
                  >
                    Senden Sie eine Nachricht, um einen Chat zu starten!
                  </Typography>
                </Stack>
              )}
            </Box>
            <InputComponent
              name="message"
              selectFieldName="mentionedUsers"
              roomMembers={[]}
            />
          </FormPlus>
        )}
      </Formik>
    </Box>
  );
}
