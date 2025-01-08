/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogSource,
  ApiAuditLogSourceFromJSON,
  AuditLogApi,
} from "@eshg/employee-portal-api/auditlog";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { encodeReservedHtmlCharacters } from "@eshg/lib-portal/helpers/htmlStringEncoder";
import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useParams } from "next/navigation";
import { useRef } from "react";

import { useAuditlogApi } from "@/lib/auditlog/api/clients";
import { AuditLogSheet } from "@/lib/auditlog/components/AuditLogSheet";
import {
  decryptSymmetricKey,
  unwrapPrivateKey,
} from "@/lib/auditlog/components/crypto";
import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

interface AuditlogAuthorizeSidebarProps {
  encryptedPrivateKey: string[];
  open: boolean;
  onClose: () => void;
}

export interface AuditLogDecryptSidebar {
  password: string;
}

export function AuditLogDecryptSidebar({
  encryptedPrivateKey,
  open,
  onClose,
}: Readonly<AuditlogAuthorizeSidebarProps>) {
  const auditLogApi = useAuditlogApi();

  const { source: sourceParam, date: dateParam } = useParams();
  const source = ApiAuditLogSourceFromJSON(sourceParam);
  const date = new Date(dateParam as string);

  const fieldName = createFieldNameMapper<AuditLogDecryptSidebar>();
  const formRef = useRef<SidebarFormHandle>(null);
  const decryptedPrivateKey = useRef<CryptoKey>();

  function handleCloseSidebar() {
    onClose();
    formRef.current?.resetForm();
  }

  return (
    <Sidebar open={open} onClose={handleCloseSidebar}>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{ validForm: "", password: "" }}
        validate={async (values) => {
          const decryptedPrivateKeyResult = await unwrapPrivateKey(
            encryptedPrivateKey,
            values.password,
          ).catch(() => {
            return new Error("Invalid password.");
          });

          if (decryptedPrivateKeyResult instanceof Error) {
            return { validForm: "false" };
          }

          decryptedPrivateKey.current = decryptedPrivateKeyResult;
        }}
        onSubmit={async () => {
          const decryptedSymmetricKey = await decryptSymmetricKey(
            decryptedPrivateKey.current!,
            await fetchEncryptedSymmetricKey(auditLogApi, source, date),
          );

          const auditLogFile = await readAuditLogFile(
            auditLogApi,
            decryptedSymmetricKey,
            source,
            date,
          );

          const newAuditLogTab = window.open("about:blank", "_blank")!;
          newAuditLogTab.document.write(
            `<pre>${encodeReservedHtmlCharacters(auditLogFile)}</pre>`,
          );
          newAuditLogTab.document.title = `${formatDate(date)} | ${auditLogSourceNames[source]} | Auditlog`;
          newAuditLogTab.document.close();

          handleCloseSidebar();
        }}
      >
        {({ isSubmitting, errors }) => (
          <SidebarForm ref={formRef}>
            <SidebarContent title={"Log File anzeigen"}>
              <DetailsColumn sx={{ gap: 2 }}>
                <AuditLogSheet date={date} source={sourceParam} />
                <Stack gap={2} sx={{ mt: 2 }}>
                  <Typography level="title-md">Entschlüsseln</Typography>
                  <Typography level="body-md">
                    Bitte geben Sie zum Entschlüsseln Ihr Passwort ein.
                  </Typography>
                  <PasswordField
                    data-testid={"passwordField"}
                    label={"Passwort eingeben"}
                    name={fieldName("password")}
                  />
                  {errors.validForm === "false" && <InvalidPassword />}
                </Stack>
              </DetailsColumn>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={"Log File anzeigen"}
                submitting={isSubmitting}
                onCancel={handleCloseSidebar}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

async function fetchEncryptedSymmetricKey(
  auditLogApi: AuditLogApi,
  source: ApiAuditLogSource,
  date: Date,
) {
  return await auditLogApi.getEncryptedSymmetricKey(source, date);
}

async function readAuditLogFile(
  auditLogApi: AuditLogApi,
  decryptedSymmetricKey: string,
  source: ApiAuditLogSource,
  date: Date,
) {
  return await auditLogApi.readAuditLogFile(
    decryptedSymmetricKey,
    source,
    date,
  );
}

function InvalidPassword() {
  return (
    <Typography mb={2} color={"danger"} fontSize={"small"}>
      Das angegebene Passwort ist ungültig.
    </Typography>
  );
}
