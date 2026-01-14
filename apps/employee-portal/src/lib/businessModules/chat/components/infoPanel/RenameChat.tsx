/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikErrors } from "formik";

import { FormPlus, InputField, useSnackbar } from "@eshg/lib-portal";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

interface RenameChatProps {
  roomId: string;
  onCancel: () => void;
}

export function RenameChat({ roomId, onCancel }: Readonly<RenameChatProps>) {
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
    <Box
      sx={{
        overflowY: "auto",
        padding: 2,
      }}
    >
      <Typography
        level="title-lg"
        component="h3"
        id="rename-group-label"
        sx={{ marginBottom: 2 }}
      >
        Gruppe umbenennen
      </Typography>
      <Formik
        initialValues={{ name: "" }}
        validate={validateForm}
        onSubmit={handleRenameChat}
      >
        <FormPlus aria-labelledby="rename-group-label">
          <InputField
            name="name"
            placeholder="Neuen Namen eingeben"
            aria-label="Gruppenname"
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
  );
}
