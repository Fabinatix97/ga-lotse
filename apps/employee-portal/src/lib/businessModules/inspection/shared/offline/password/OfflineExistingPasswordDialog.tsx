/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { FormButtonBar, useIsOffline } from "@eshg/lib-employee-portal";
import { Alert, FormPlus } from "@eshg/lib-portal";

import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";

import { OfflinePasswordDialog } from "./OfflinePasswordDialog";

export function OfflineExistingPasswordDialog({
  onPassword,
  onClear,
  waiting,
  retry,
}: Readonly<{
  onPassword: (pwd: string) => Promise<void>;
  onClear: () => Promise<void>;
  waiting: boolean;
  retry: boolean;
}>) {
  const isOffline = useIsOffline();

  async function handleSubmit({ password }: { password: string }) {
    await onPassword(password);
  }

  return (
    <OfflinePasswordDialog
      waiting={waiting}
      title="Offline Passwort"
      description="Bitte geben Sie ihr Offline Passwort ein um fortzufahren."
    >
      <Formik initialValues={{ password: "" }} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <FormPlus>
            <Stack gap={3}>
              {retry && (
                <Alert
                  title="Falsches Passwort"
                  message="Das von ihnen eingegebene Passwort ist falsch."
                  color="danger"
                  variant="soft"
                />
              )}
              <PasswordField
                name="password"
                label="Passwort"
                required="Bitte geben sie ein Passwort ein"
              />
              <FormButtonBar
                submitLabel="Anmelden"
                submitting={isSubmitting}
                left={
                  !isOffline && (
                    <Button color="danger" variant="plain" onClick={onClear}>
                      Abbrechen
                    </Button>
                  )
                }
              />
            </Stack>
          </FormPlus>
        )}
      </Formik>
    </OfflinePasswordDialog>
  );
}
