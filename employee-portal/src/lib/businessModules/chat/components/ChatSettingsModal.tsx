/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Box, FormLabel, Radio, Sheet, Typography } from "@mui/joy";
import { Formik } from "formik";
import { HistoryVisibility } from "matrix-js-sdk/lib/matrix";
import { isEmpty } from "remeda";

import { SettingsFormValues } from "@/lib/businessModules/chat/components/ChatsPane";
import { ChatBaseModal } from "@/lib/businessModules/chat/shared/types";
import { BaseModal } from "@/lib/shared/components/BaseModal";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";

const historyVisibilityOptions = [
  {
    value: HistoryVisibility.Invited,
    label: "Nur Mitglieder (seit sie eingeladen wurden)",
  },
  {
    value: HistoryVisibility.Joined,
    label: "Nur Mitglieder (seit sie beigetreten sind)",
  },
  {
    value: HistoryVisibility.Shared,
    label: "Nur Mitglieder (ab dem Zeitpunkt der Aktivierung dieser Option)",
  },
];

interface ChatSettingsModalProps extends ChatBaseModal<SettingsFormValues> {
  initialFormValues: SettingsFormValues;
}

export function ChatSettingsModal({
  open,
  onClose,
  onSubmit,
  initialFormValues,
  validateForm,
}: Readonly<ChatSettingsModalProps>) {
  return (
    <BaseModal open={open} onClose={onClose} modalTitle="Chat-Einstellungen">
      <Sheet
        variant="plain"
        sx={{
          minHeight: "20rem",
        }}
      >
        <Formik<SettingsFormValues>
          initialValues={initialFormValues}
          onSubmit={onSubmit}
          validate={validateForm}
        >
          {({ isSubmitting, errors }) => (
            <FormPlus>
              <FormLabel htmlFor="historyVisibility">
                Wer kann den Verlauf lesen?
              </FormLabel>
              <Typography level="body-xs">
                Änderungen bezüglich der Leseberechtigung für den Verlauf gelten
                nur für zukünftige Nachrichten in diesem Chatroom. Die
                Sichtbarkeit des bestehenden Verlaufs bleibt unverändert.
              </Typography>
              <RadioGroupField name="historyVisibility">
                {historyVisibilityOptions.map(({ label, value }) => (
                  <Radio value={value} label={label} key={value} size="sm" />
                ))}
              </RadioGroupField>
              <Box marginTop={4}>
                <SubmitButton
                  submitting={isSubmitting}
                  disabled={!isEmpty(errors)}
                >
                  Speichern
                </SubmitButton>
              </Box>
            </FormPlus>
          )}
        </Formik>
      </Sheet>
    </BaseModal>
  );
}
