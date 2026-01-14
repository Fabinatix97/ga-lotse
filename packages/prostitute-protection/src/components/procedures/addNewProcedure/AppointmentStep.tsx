/**
 * Copyright 2026 cronn GmbH
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
import { SelectField, buildEnumOptions } from "@eshg/lib-portal";

import { CONSULTATION_TYPE_VALUES } from "../../../shared/constants";
import { AppointmentFields } from "../../form/AppointmentFields";

import { FieldProps, LayoutProps } from "./useAddNewProcedureSidebar";

export function AppointmentStep(props: FieldProps) {
  return (
    <Layout {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  return (
    <Stack gap={2} mt={2}>
      <SelectField
        name="consultationType"
        label="Beratungstyp"
        options={buildEnumOptions(CONSULTATION_TYPE_VALUES)}
      />
      <Divider sx={{ marginBlock: 1 }} />
      <AppointmentFields isCreation />
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
  const { isSubmitting } = useFormikContext();
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
