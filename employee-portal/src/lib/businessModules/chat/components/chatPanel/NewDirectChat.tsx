/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Box, Button, Stack, Typography, useTheme } from "@mui/joy";
import { Formik, FormikErrors } from "formik";
import { isObjectType } from "remeda";

import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { UsersAutocomplete } from "@/lib/businessModules/chat/components/UsersAutocomplete";
import { ChatMessages } from "@/lib/businessModules/chat/components/chatPanel/ChatMessages";
import { InputComponent } from "@/lib/businessModules/chat/components/chatPanel/InputComponent";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { ApiUser } from "@/lib/businessModules/chat/shared/types";

export interface DirectChatFormValues {
  invite: string;
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
  const { createNewDirectMessage, findExisingRoom } = useCreateNewChat();
  const { sendMessage } = useSendMessage();
  const theme = useTheme();
  const { setRoomIdParam } = useChatSearchParams();

  const snackbar = useSnackbar();

  async function handleStartDirectMessage(values: DirectChatFormValues) {
    try {
      const newRoomId = await createNewDirectMessage({
        invite: [values.invite],
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
  function validateDMForm(
    values: DirectChatFormValues,
  ): FormikErrors<DirectChatFormValues> {
    const errors: FormikErrors<DirectChatFormValues> = {};
    if (!values.invite || values.invite === "") {
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
        initialValues={{ invite: "", message: "" }}
        onSubmit={handleStartDirectMessage}
        validate={validateDMForm}
      >
        {({ values }) => {
          const existingChat =
            values.invite &&
            !Array.isArray(values.invite) &&
            findExisingRoom(values.invite);
          if (existingChat) {
            setRoomIdParam(existingChat.room.roomId);
          }
          return (
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
              {isObjectType(existingChat) && existingChat?.room.roomId ? (
                <ChatMessages room={existingChat} />
              ) : (
                <>
                  <ChatIllustrationBackground />
                  <Box sx={{ minHeight: "2rem" }}>
                    {values.invite && !isObjectType(existingChat) && (
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
                </>
              )}
              <InputComponent
                name="message"
                selectFieldName="mentionedUsers"
                roomMembers={[]}
              />
            </FormPlus>
          );
        }}
      </Formik>
    </Box>
  );
}
