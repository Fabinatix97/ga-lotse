/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRef, useState } from "react";

import { ApiChatFeature } from "@eshg/chat-management-api";
import {
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  ButtonLink,
  createFieldNameMapper,
  useSnackbar,
} from "@eshg/lib-portal";

import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/chat/api/queries/featureTogglesApi";
import { SecureBackupContent } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { FactoryResetModal } from "@/lib/businessModules/chat/components/secureBackup/FactoryResetModal";
import { fetchBackupInfo } from "@/lib/businessModules/chat/matrix/crypto";
import {
  loadKeyBackupPrivateKeyFromSecretStorage,
  validatePassphrase,
  validateRecoveryKey,
} from "@/lib/businessModules/chat/matrix/secretStorage";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";

const initialValues = {
  passphrase: "",
  recoveryKey: "",
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

  const { data: featureToggleResetPassphraseEnabled } =
    useIsNewFeatureEnabledUnsuspended(ApiChatFeature.ResetKeyBackupPassphrase);
  const [factoryResetModalOpen, setFactoryResetModalOpen] = useState(false);

  function handleClose() {
    onClose();
    formRef.current?.resetForm();
  }

  async function validateSecretStoragePassphrase(values: InitialValues) {
    if (values.recoveryKey) {
      try {
        await validateRecoveryKey(matrixClient, values.recoveryKey);
      } catch {
        return {
          recoveryKey: "Ungültiger Wiederherstellungsschlüssel.",
        };
      }
    } else {
      try {
        await validatePassphrase(matrixClient, values.passphrase);
      } catch {
        return {
          passphrase:
            "Fehler bei der Verifizierung des Geräts. Ist die Phrase korrekt?",
        };
      }
    }
  }

  async function handleSubmit(values: InitialValues) {
    try {
      logger.info("Step 6/6 RestoreKeyBackupFromSecretStorage");
      const { keyBackupInfo, hasKeyBackupKeyStored } =
        await fetchBackupInfo(matrixClient);

      if (!keyBackupInfo || !hasKeyBackupKeyStored) {
        throw new Error("No backupInfo stored on the server");
      }

      await loadKeyBackupPrivateKeyFromSecretStorage(
        matrixClient,
        values.passphrase,
        values.recoveryKey,
      );
      setClientState(ClientState.Ready);
      logger.info("Step 6/6 RestoreKeyBackupFromSecretStorage - FINISHED");
      snackbar.confirmation("Ihr Gerät wurde nun verifiziert", {
        manualClose: true,
      });
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
          validateOnBlur={false}
          validateOnChange={false}
          validate={validateSecretStoragePassphrase}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
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
                    data-testid="passphrase"
                    label="Neues Passwort"
                    name={fieldName("passphrase")}
                  />
                  <PasswordField
                    data-testid="recovery-key"
                    label="Oder Wiederherstellungsschlüssel"
                    name={fieldName("recoveryKey")}
                  />
                  {featureToggleResetPassphraseEnabled && (
                    <Stack direction="row" spacing={0.5}>
                      <Typography level="body-sm" color="neutral">
                        Wiederherstellungsphrase vergessen oder verloren?{` `}
                        <ButtonLink
                          level="body-sm"
                          color="danger"
                          onClick={() => setFactoryResetModalOpen(true)}
                        >
                          Alles zurücksetzen
                        </ButtonLink>
                      </Typography>
                    </Stack>
                  )}
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
      <FactoryResetModal
        color="danger"
        open={factoryResetModalOpen}
        onClose={() => setFactoryResetModalOpen(false)}
      />
    </>
  );
}
