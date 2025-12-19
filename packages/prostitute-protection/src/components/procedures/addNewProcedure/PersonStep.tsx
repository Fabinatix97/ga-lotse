/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider, Stack } from "@mui/joy";
import { useFormikContext } from "formik";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { InputField, useValidateLength } from "@eshg/lib-portal";

import { PERSON_FIELD_NAME } from "../../../shared/constants";
import { LanguageFields } from "../../form/LanguageFields";

import {
  AddNewProcedureForm,
  FieldProps,
  LayoutProps,
} from "./useAddNewProcedureSidebar";

export function PersonStep(props: FieldProps) {
  return (
    <Layout {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  const validateLength = useValidateLength();

  return (
    <Stack gap={2} mt={2}>
      <InputField
        name="alias"
        label={PERSON_FIELD_NAME.alias}
        required="Bitte einen Alias angeben."
        validate={validateLength(1, 80)}
      />
      <Divider sx={{ marginBlock: 1 }} />
      <LanguageFields />
    </Stack>
  );
}

function Layout<T>({
  children,
  handlePrev,
  isOnLastStep,
  isOnFirstStep,
  onClose,
  formRef,
  title,
  subTitle,
}: LayoutProps<T>) {
  const { isSubmitting } = useFormikContext<AddNewProcedureForm>();
  return (
    <SidebarForm ref={formRef}>
      <SidebarContent title={title} subtitle={subTitle}>
        {children}
      </SidebarContent>
      <SidebarActions>
        <MultiFormButtonBar
          submitting={isSubmitting}
          submitLabel={isOnLastStep ? "Erstellen" : "Weiter"}
          onCancel={onClose}
          onBack={isOnFirstStep ? undefined : handlePrev}
        />
      </SidebarActions>
    </SidebarForm>
  );
}
