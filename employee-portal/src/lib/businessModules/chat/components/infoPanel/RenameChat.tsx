/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import { InfoPanelHeader } from "@/lib/businessModules/chat/components/infoPanel/InfoPanelHeader";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

interface RenameChatProps {
  roomId: string;
  onClose: () => void;
  onCancel: () => void;
}

export function RenameChat({
  roomId,
  onClose,
  onCancel,
}: Readonly<RenameChatProps>) {
  const { matrixClient } = useChatClientContext();
  const snackbar = useSnackbar();

  async function handleRenameChat(values: { name: string }) {
    try {
      await matrixClient.setRoomName(roomId, values.name);
      onCancel();
    } catch (error) {
      logger.error("The chat name could not be changed", error);
      snackbar.error("Der Chatname konnte nicht geändert werden");
    }
  }

  function validateForm(values: {
    name?: string;
  }): FormikErrors<{ name?: string }> {
    const errors: FormikErrors<{ name?: string }> = {};
    if (!values.name) {
      errors.name = "Bitte fügen Sie den Chatnamen hinzu";
    }
    return errors;
  }

  return (
    <>
      <InfoPanelHeader close={onClose} roomId={roomId} />
      <Box
        sx={{
          overflowY: "auto",
          padding: 2,
        }}
      >
        <Typography level="title-lg" sx={{ marginBottom: 2 }}>
          Gruppe umbenennen
        </Typography>
        <Formik
          initialValues={{ name: "" }}
          onSubmit={handleRenameChat}
          validate={validateForm}
        >
          <FormPlus>
            <InputField
              name="name"
              placeholder="Neuen Namen eingeben"
              aria-label="Group name"
              label=""
            />
            <Stack direction="row" spacing={2} marginTop={2}>
              <Button type="button" fullWidth variant="soft" onClick={onCancel}>
                Abbrechen
              </Button>
              <Button type="submit" fullWidth>
                Speichern
              </Button>
            </Stack>
          </FormPlus>
        </Formik>
      </Box>
    </>
  );
}
