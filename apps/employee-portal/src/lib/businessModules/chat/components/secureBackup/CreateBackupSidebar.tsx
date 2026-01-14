/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { AuthDict, IAuthData } from "matrix-js-sdk";
import {
  CryptoApi,
  GeneratedSecretStorageKey,
} from "matrix-js-sdk/lib/crypto-api";
import { useCallback, useRef, useState } from "react";
import { isObjectType } from "remeda";

import {
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { createFieldNameMapper, useSnackbar } from "@eshg/lib-portal";

import { useBindKeycloakId } from "@/lib/businessModules/chat/api/mutations/userAccountApi";
import { SecureBackupContent } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { RecoveryKeyModal } from "@/lib/businessModules/chat/components/secureBackup/RecoveryKeyModal";
import { SSOAuthModal } from "@/lib/businessModules/chat/components/secureBackup/SSOAuthModal";
import { getCryptoApi } from "@/lib/businessModules/chat/matrix/crypto";
import {
  bootstrapNewSecretStorage,
  hasKeyBackupInSecretStorage,
} from "@/lib/businessModules/chat/matrix/secretStorage";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";
import {
  getPasswordValidityInfo,
  validatePassword,
} from "@/lib/shared/helpers/validatePassword";

const initialValues = {
  validForm: "",
  passphrase: "",
  repeatedPassphrase: "",
};

type InitialValues = typeof initialValues;

type MakeRequest = (authData: AuthDict | null) => Promise<void>;

export interface SSOAuthModalValues {
  makeRequest: MakeRequest;
  session: string;
  onFinished: (confirmed: boolean) => void;
}

interface CreateBackupSidebarProps {
  open: boolean;
  onClose: () => void;
  content: SecureBackupContent;
}

export function CreateBackupSidebar({
  open,
  onClose,
  content,
}: CreateBackupSidebarProps) {
  const fieldName = createFieldNameMapper<InitialValues>();
  const formRef = useRef<SidebarFormHandle>(null);
  const { matrixClient, setClientState } = useChatClientContext();
  const snackbar = useSnackbar();
  const { mutateAsync: bindKeycloakId } = useBindKeycloakId();
  const [recoveryKeyModalOpen, setRecoveryKeyModalOpen] = useState(false);
  const recoveryKeyValue = useRef<string>(undefined);
  const [modalValues, setModalValues] = useState<SSOAuthModalValues>();

  const showSSOModal = useCallback(
    (modalValues: Omit<SSOAuthModalValues, "onFinished">) => {
      return new Promise<{ confirmed: boolean }>((resolve) => {
        function onFinished(confirmed: boolean) {
          resolve({ confirmed });
          setModalValues(undefined);
        }

        setModalValues({ ...modalValues, onFinished });
      });
    },
    [],
  );

  function handleClose() {
    onClose();
    formRef.current?.resetForm();
  }

  const authUploadDeviceSigningKeys = useCallback(
    async (makeRequest: MakeRequest) => {
      // Complying with the User-Interactive Authentication API of uploading device signing keys,
      // we first make a request without the auth parameter and retrieve the session id (as well as authentication flow data).
      // We use this session id to authenticate the API request the second time.
      // url: https://spec.matrix.org/v1.6/client-server-api/#example
      try {
        await makeRequest(null);
        throw new Error("Provide auth data");
      } catch (error) {
        if (isObjectType(error) && "data" in error) {
          const { session } = error.data as IAuthData;

          if (!session) {
            throw new Error("Unable to receive session");
          }

          try {
            const mxid = matrixClient.getUserId();
            if (!mxid) {
              throw new Error("Unexpected error: Missing user MXID");
            }

            await bindKeycloakId({ matrixUserId: mxid });
          } catch (err) {
            throw new Error("Error binding keycloak id to synapse user", {
              cause: err,
            });
          }

          const modalPromise = showSSOModal({ makeRequest, session });
          const { confirmed } = await modalPromise;

          logger.debug(confirmed);

          if (!confirmed) {
            throw new Error("SSO Auth failed");
          }
        }
      }
    },
    [showSSOModal, bindKeycloakId, matrixClient],
  );

  const handleDoneShowingRecoveryKeyModal = useCallback(() => {
    setRecoveryKeyModalOpen(false);
    snackbar.confirmation("Sicherheitsbackup erfolgreich eingerichtet", {
      manualClose: true,
    });
    setClientState(ClientState.Ready);
  }, [setClientState, snackbar]);

  async function handleSubmit(values: InitialValues) {
    try {
      logger.info("Step 6/6 CreateKeyBackupInSecretStorage");
      const hasBackupInSecretStorage: boolean =
        await hasKeyBackupInSecretStorage(matrixClient);
      if (hasBackupInSecretStorage) {
        logger.error(
          "Aborting bootstrapNewSecretStorage because KeyBackup already exists in 4S",
        );
        snackbar.error("Unexpected error, KeyBackup is already ");
        setClientState(ClientState.HardReset);
        return;
      }
      const cryptoApi: CryptoApi = getCryptoApi(matrixClient);

      const secretStorageRecoveryKeyPromise: Promise<GeneratedSecretStorageKey> =
        cryptoApi.createRecoveryKeyFromPassphrase(values.passphrase);
      await bootstrapNewSecretStorage(
        matrixClient,
        secretStorageRecoveryKeyPromise,
        authUploadDeviceSigningKeys,
      );
      const secretStorageRecoveryKey = await secretStorageRecoveryKeyPromise;

      recoveryKeyValue.current = secretStorageRecoveryKey.encodedPrivateKey;
      if (!recoveryKeyValue.current) {
        throw new Error("Invalid recovery key");
      }
      setRecoveryKeyModalOpen(true);
      logger.info("Step 6/6 CreateKeyBackupInSecretStorage - FINISHED");
    } catch (e) {
      handleClose();
      snackbar.error("Einrichten des Sicherheitsbackups fehlgeschlagen");
      logger.error(e);
    }
  }

  return (
    <>
      <Sidebar open={open} onClose={handleClose}>
        {recoveryKeyValue.current && (
          <RecoveryKeyModal
            open={recoveryKeyModalOpen}
            recoveryKey={recoveryKeyValue.current}
            handleDoneClick={handleDoneShowingRecoveryKeyModal}
          />
        )}
        <Formik
          initialValues={initialValues}
          validate={(values) => {
            if (
              !validatePassword(values.passphrase, values.repeatedPassphrase)
            ) {
              return { validForm: "false" };
            }
          }}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
        >
          {({ isSubmitting, values, errors }) => (
            <SidebarForm ref={formRef}>
              <SidebarContent title={content.headerSidebar}>
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
                    aria-describedby="password-requirements"
                  />
                  <PasswordField
                    data-testid="repeatedPassphrase"
                    label="Passwort wiederholen"
                    name={fieldName("repeatedPassphrase")}
                    aria-describedby="password-requirements"
                  />
                </Stack>
                <PasswortRequirementHints
                  erroneous={errors.validForm === "false"}
                  password={values.passphrase}
                  repeatedPassword={values.repeatedPassphrase}
                  hintSectionId="password-requirements"
                />
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
      <SSOAuthModal values={modalValues} />
    </>
  );
}

interface PasswortRequirementHintsProps {
  erroneous: boolean;
  password: string;
  repeatedPassword: string;
  hintSectionId?: string;
}

function PasswortRequirementHints({
  erroneous,
  password,
  repeatedPassword,
  hintSectionId,
}: Readonly<PasswortRequirementHintsProps>) {
  return (
    <Stack gap={0.5} mt={3}>
      <Typography mb={1} level="body-md" component="h2">
        Anforderungen an das Passwort:
      </Typography>

      <Box display="contents" role="list" id={hintSectionId}>
        {getPasswordValidityInfo(password, repeatedPassword).map(
          ({ message, valid }) => (
            <Typography
              key={message}
              fontWeight="lighter"
              startDecorator={getPasswordRuleDecorator(valid)}
              color={getPasswordRuleColor(valid, erroneous)}
              fontSize="small"
              role="listitem"
            >
              {message}
            </Typography>
          ),
        )}
      </Box>
    </Stack>
  );
}

function getPasswordRuleDecorator(valid: boolean) {
  return valid ? <CheckCircleOutline /> : <RadioButtonUnchecked />;
}

function getPasswordRuleColor(valid: boolean, erroneous: boolean) {
  if (valid) return "success";
  return erroneous ? "danger" : "neutral";
}
