/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRef, useState } from "react";

import { SecureBackupContent } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { ResetBackupModal } from "@/lib/businessModules/chat/components/secureBackup/ResetBackupModal";
import { fetchBackupInfo } from "@/lib/businessModules/chat/matrix/crypto";
import {
  restoreKeyBackupWithSecretStorage,
  validateAccessSecretStorage,
} from "@/lib/businessModules/chat/matrix/secretStorage";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

const initialValues = {
  passphrase: "",
};

type InitialValues = typeof initialValues;

interface RestoreBackupSidebarProps {
  open: boolean;
  onClose: () => void;
  content: SecureBackupContent;
}

export function RestoreBackupSidebar({
  open,
  onClose,
  content,
}: RestoreBackupSidebarProps) {
  const fieldName = createFieldNameMapper<InitialValues>();
  const formRef = useRef<SidebarFormHandle>(null);
  const { matrixClient, setClientState } = useChatClientContext();
  const snackbar = useSnackbar();

  const [modalOpen, setModalOpen] = useState(false);

  function handleClose() {
    onClose();
    formRef.current?.resetForm();
  }

  async function validateSecretPhrase(values: InitialValues) {
    try {
      await validateAccessSecretStorage(matrixClient, values.passphrase);
      return undefined;
    } catch {
      return {
        passphrase:
          "Fehler bei der Verifizierung des Geräts. Ist die Phrase korrekt?",
      };
    }
  }

  async function handleSubmit(values: InitialValues) {
    try {
      const { backupInfo, backupKeyStored } =
        await fetchBackupInfo(matrixClient);

      if (!backupInfo) {
        throw new Error("No backup Info");
      }

      await restoreKeyBackupWithSecretStorage(
        matrixClient,
        backupInfo,
        backupKeyStored,
        values.passphrase,
      );
      setClientState(ClientState.Prepared);
      snackbar.confirmation("Ihr Gerät wurde nun verifiziert");
    } catch (e) {
      handleClose();
      snackbar.error("Kein Zugriff auf den Chat");
      setClientState(ClientState.Error);
      logger.error(e);
    }
  }

  return (
    <>
      <Sidebar open={open} onClose={handleClose}>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
          validateOnBlur={false}
          validateOnChange={false}
          validate={validateSecretPhrase}
        >
          {({ isSubmitting }) => (
            <SidebarForm ref={formRef}>
              <SidebarContent title={content.header}>
                <Stack gap={2}>
                  {content.description.map((i) => (
                    <Typography key={i} level="body-md">
                      {i}
                    </Typography>
                  ))}
                  <PasswordField
                    data-testid={"passphrase"}
                    label={"Sicherheitsphrase vergeben"}
                    name={fieldName("passphrase")}
                    visibilityLabel={"visiblePassphrase"}
                  />
                  <Stack direction="row" spacing={0.5}>
                    <Typography level="body-sm" color="neutral">
                      Wiederherstellungsphrase vergessen oder verloren?{` `}
                      <ButtonLink
                        level="body-sm"
                        color="danger"
                        onClick={() => setModalOpen(true)}
                      >
                        Alles zurücksetzen
                      </ButtonLink>
                    </Typography>
                  </Stack>
                </Stack>
              </SidebarContent>
              <SidebarActions>
                <FormButtonBar
                  submitLabel="Fortfahren"
                  submitting={isSubmitting}
                  onCancel={handleClose}
                />
              </SidebarActions>
            </SidebarForm>
          )}
        </Formik>
      </Sidebar>
      <ResetBackupModal
        color="danger"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
