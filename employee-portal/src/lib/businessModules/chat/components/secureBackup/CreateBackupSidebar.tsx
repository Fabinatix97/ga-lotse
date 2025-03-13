/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { AuthDict, IAuthData, UIAResponse } from "matrix-js-sdk";
import { useCallback, useRef, useState } from "react";
import { isObjectType } from "remeda";

import { useBindKeycloakId } from "@/lib/businessModules/chat/api/mutations/userAccountApi";
import { SecureBackupContent } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { SSOAuthModal } from "@/lib/businessModules/chat/components/secureBackup/SSOAuthModal";
import { setupNewSecretStorage } from "@/lib/businessModules/chat/matrix/secretStorage";
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

export type MakeRequest = (
  authData: AuthDict | null,
) => Promise<UIAResponse<void>>;

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

  async function handleSubmit(values: InitialValues) {
    try {
      await setupNewSecretStorage(
        matrixClient,
        values.passphrase,
        authUploadDeviceSigningKeys,
      );
      setClientState(ClientState.Prepared);
      snackbar.confirmation("Sicherheitsbackup erfolgreich eingerichtet");
    } catch (e) {
      handleClose();
      snackbar.error("Einrichten des Sicherheitsbackups fehlgeschlagen");
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
          validate={(values) => {
            if (
              !validatePassword(values.passphrase, values.repeatedPassphrase)
            ) {
              return { validForm: "false" };
            }
          }}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ isSubmitting, values, errors }) => (
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
                  <PasswordField
                    data-testid={"repeatedPassphrase"}
                    label={"Sicherheitsphrase wiederholen"}
                    name={fieldName("repeatedPassphrase")}
                    visibilityLabel={"visibleRepeatedPassphrase"}
                  />
                </Stack>
                <PasswortRequirementHints
                  erroneous={errors.validForm === "false"}
                  password={values.passphrase}
                  repeatedPassword={values.repeatedPassphrase}
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
}

function PasswortRequirementHints({
  erroneous,
  password,
  repeatedPassword,
}: Readonly<PasswortRequirementHintsProps>) {
  return (
    <Stack gap={0.5} mt={3}>
      {erroneous && (
        <Typography mb={2} color={"danger"} fontSize={"small"}>
          Bitte beachten Sie die Sicherheitsphrasenanforderungen
        </Typography>
      )}

      <Typography
        mb={1}
        color={erroneous ? "danger" : "neutral"}
        fontSize={"small"}
      >
        Anforderungen an Sicherheitsphrasen:
      </Typography>

      {getPasswordValidityInfo(password, repeatedPassword).map(
        ({ message, valid }) => (
          <Typography
            fontWeight={"lighter"}
            startDecorator={getPasswordRuleDecorator(valid)}
            key={message}
            color={getPasswordRuleColor(valid, erroneous)}
            fontSize={"small"}
          >
            {message}
          </Typography>
        ),
      )}
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
