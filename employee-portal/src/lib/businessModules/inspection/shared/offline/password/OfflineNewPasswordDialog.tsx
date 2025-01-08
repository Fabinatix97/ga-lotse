/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { OfflinePasswordDialog } from "@/lib/businessModules/inspection/shared/offline/password/OfflinePasswordDialog";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";
import { validateMatches } from "@/lib/shared/helpers/validators";
import {
  getPasswordInfo,
  validatePassword,
} from "@/serviceWorker/common/validatePassword";

export function OfflineNewPasswordDialog({
  onPassword,
  onClear,
  waiting,
}: Readonly<{
  onPassword: (pwd: string) => Promise<void>;
  onClear: () => Promise<void>;
  waiting: boolean;
}>) {
  async function handleSubmit({ password }: { password: string }) {
    await onPassword(password);
  }

  return (
    <OfflinePasswordDialog
      waiting={waiting}
      title="Offline Passwort"
      description="Bitte erstellen Sie ein Passwort, um die Offline-Funktion zu
            aktivieren. Das Passwort wird genutzt um ihre Daten im Offline-Modus
            zu verschlüsseln."
    >
      <Formik
        initialValues={{ password: "", passwordConfirmation: "" }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <FormPlus>
            <Stack gap={3}>
              <Stack gap={2}>
                <PasswordField
                  name="password"
                  label="Passwort"
                  validate={validatePassword}
                  required="Bitte geben sie ein Passwort ein"
                />
                <PasswordField
                  name="passwordConfirmation"
                  label="Passwort wiederholen"
                  validate={validateMatches(
                    values.password,
                    "Die eingegebenen Passwörter stimmen nicht überein",
                  )}
                  required="Bitte geben sie ein Passwort ein"
                />
              </Stack>
              <PasswordInfoSheet password={values.password} />
              <FormButtonBar
                submitLabel="Passwort erstellen"
                submitting={isSubmitting}
                left={
                  <Button color="danger" variant="plain" onClick={onClear}>
                    Abbrechen
                  </Button>
                }
              />
            </Stack>
          </FormPlus>
        )}
      </Formik>
    </OfflinePasswordDialog>
  );
}

function PasswordInfoSheet({ password }: { password: string }) {
  return (
    <Stack gap={0.5}>
      <Typography mb={1} fontSize="small">
        Passwortanforderungen:
      </Typography>

      {getPasswordInfo(password).map(({ message, valid }) => (
        <Typography
          key={message}
          sx={{ gap: 0.5 }}
          startDecorator={getPasswordRuleDecorator(valid)}
          color={getPasswordRuleColor(valid)}
          fontWeight="lighter"
          fontSize="small"
        >
          {message}
        </Typography>
      ))}
    </Stack>
  );
}

function getPasswordRuleDecorator(valid: boolean) {
  return valid ? (
    <CheckCircleOutline fontSize="sm" aria-hidden />
  ) : (
    <RadioButtonUnchecked fontSize="sm" aria-hidden />
  );
}

function getPasswordRuleColor(valid: boolean) {
  return valid ? "success" : "neutral";
}
