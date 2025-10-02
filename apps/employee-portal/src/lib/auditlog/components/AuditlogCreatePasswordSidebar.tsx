/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CheckCircleOutline, RadioButtonUnchecked } from "@mui/icons-material";
import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import {
  FormButtonBar,
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { createFieldNameMapper } from "@eshg/lib-portal";

import { generateKeyPairs } from "@/lib/auditlog/components/crypto";
import { useAddEmployeeSelfUserKeys } from "@/lib/baseModule/api/mutations/users";
import { routes } from "@/lib/baseModule/shared/routes";
import { PasswordField } from "@/lib/shared/components/formFields/PasswordField";
import {
  getPasswordValidityInfo,
  validatePassword,
} from "@/lib/shared/helpers/validatePassword";

export interface AuditlogCreatePasswordSidebar {
  password: string;
  repeatedPassword: string;
}

interface AuditlogCreatePasswordSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AuditlogCreatePasswordSidebar({
  open,
  onClose,
}: Readonly<AuditlogCreatePasswordSidebarProps>) {
  const addEmployeeSelfUserKeys = useAddEmployeeSelfUserKeys();

  const router = useRouter();
  const fieldName = createFieldNameMapper<AuditlogCreatePasswordSidebar>();
  const formRef = useRef<SidebarFormHandle>(null);

  function handleClose() {
    onClose();
    formRef.current?.resetForm();
  }

  return (
    <Sidebar open={open} onClose={handleClose}>
      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        validate={(values) => {
          if (!validatePassword(values.password, values.repeatedPassword)) {
            return { validForm: "false" };
          }
        }}
        initialValues={{ validForm: "", password: "", repeatedPassword: "" }}
        onSubmit={async ({ password }) => {
          await addEmployeeSelfUserKeys.mutateAsync(
            await generateKeyPairs(password),
            {
              onSuccess: () => router.push(routes.auditlog.index),
            },
          );
        }}
      >
        {({ isSubmitting, values, errors }) => (
          <SidebarForm ref={formRef}>
            <SidebarContent title="Passwort erstellen">
              <Stack gap={2}>
                <Typography level="body-md">
                  Bitte vergeben Sie ein Passwort, um Log Files anzuzeigen. Bei
                  Verlust des Passworts verlieren Sie den Zugang zu den
                  freigegeben Log Files.
                </Typography>
                <PasswordField
                  data-testid="passwordField"
                  label="Neues Passwort"
                  name={fieldName("password")}
                />
                <PasswordField
                  data-testid="repeatedPasswordField"
                  label="Passwort wiederholen"
                  name={fieldName("repeatedPassword")}
                />
              </Stack>
              <PasswortRequirementHints
                erroneous={errors.validForm === "false"}
                password={values.password}
                repeatedPassword={values.repeatedPassword}
              />
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel="Passwort festlegen"
                submitting={isSubmitting}
                onCancel={handleClose}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
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
        <Typography mb={2} color="danger" fontSize="small">
          Bitte beachten Sie die Passwortanforderungen
        </Typography>
      )}

      <Typography
        mb={1}
        color={erroneous ? "danger" : "neutral"}
        fontSize="small"
      >
        Passwortanforderungen:
      </Typography>

      {getPasswordValidityInfo(password, repeatedPassword).map(
        ({ message, valid }) => (
          <Typography
            key={message}
            fontWeight="lighter"
            startDecorator={getPasswordRuleDecorator(valid)}
            color={getPasswordRuleColor(valid, erroneous)}
            fontSize="small"
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
