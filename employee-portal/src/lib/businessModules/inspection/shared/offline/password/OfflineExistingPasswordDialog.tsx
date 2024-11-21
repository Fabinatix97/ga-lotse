/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Button, Stack } from "@mui/joy";
import { Formik } from "formik";

import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

import { OfflinePasswordDialog } from "./OfflinePasswordDialog";

export function OfflineExistingPasswordDialog({
  onPassword,
  onClear,
  waiting,
  retry,
}: Readonly<{
  onPassword: (pwd: string) => void;
  onClear: () => void;
  waiting: boolean;
  retry: boolean;
}>) {
  const isOffline = useIsOffline();

  function handleSubmit({ password }: { password: string }) {
    onPassword(password);
    return Promise.resolve();
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
