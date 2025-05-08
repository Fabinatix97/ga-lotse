/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useParams } from "next/navigation";
import { useRef } from "react";

import {
  ApiAuditLogSource,
  ApiAuditLogSourceFromJSON,
  AuditLogApi,
} from "@eshg/auditlog-api";
import {
  DetailsColumn,
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { encodeReservedHtmlCharacters } from "@eshg/lib-portal/helpers/htmlStringEncoder";

import { useAuditlogApi } from "@/lib/auditlog/api/clients";
import { AuditLogSheet } from "@/lib/auditlog/components/AuditLogSheet";
import {
  decryptSymmetricKey,
  unwrapPrivateKey,
} from "@/lib/auditlog/components/crypto";
import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";

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
  const decryptedSymmetricKey = useRef<string>(null);

  function handleCloseSidebar() {
    onClose();
    formRef.current?.resetForm();
  }

  return (
    <Sidebar open={open} onClose={handleCloseSidebar}>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{ password: "" }}
        validate={async (values) => {
          try {
            const decryptedPrivateKey = await unwrapPrivateKey(
              encryptedPrivateKey,
              values.password,
            );
            try {
              decryptedSymmetricKey.current = await decryptSymmetricKey(
                decryptedPrivateKey,
                await fetchEncryptedSymmetricKey(auditLogApi, source, date),
              );
            } catch {
              return {
                password:
                  "Es ist ein Fehler bei der Entschlüsselung aufgetreten. Falls nach dem Erstellungsdatum des Logs ihr Passwort geändert wurde, ist kein Zugriff mehr möglich.",
              };
            }
          } catch {
            return { password: "Das angegebene Passwort ist ungültig." };
          }
        }}
        onSubmit={async () => {
          const auditLogFile = await readAuditLogFile(
            auditLogApi,
            decryptedSymmetricKey.current!,
            source,
            date,
          );

          const auditLogFileContent = await auditLogFile.text();

          const newAuditLogTab = window.open("about:blank", "_blank")!;
          newAuditLogTab.document.write(
            `<pre>${encodeReservedHtmlCharacters(auditLogFileContent)}</pre>`,
          );
          newAuditLogTab.document.title = `${formatDate(date)} | ${auditLogSourceNames[source]} | Auditlog`;
          newAuditLogTab.document.close();

          handleCloseSidebar();
        }}
      >
        {({ isSubmitting }) => (
          <SidebarForm ref={formRef}>
            <SidebarContent title="Log File anzeigen">
              <DetailsColumn sx={{ gap: 2 }}>
                <AuditLogSheet date={date} source={sourceParam} />
                <Stack gap={2} sx={{ mt: 2 }}>
                  <Typography level="title-md">Entschlüsseln</Typography>
                  <Typography level="body-md">
                    Bitte geben Sie zum Entschlüsseln Ihr Passwort ein.
                  </Typography>
                  <PasswordField
                    data-testid="passwordField"
                    label="Passwort eingeben"
                    name={fieldName("password")}
                  />
                </Stack>
              </DetailsColumn>
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Log File anzeigen"
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
