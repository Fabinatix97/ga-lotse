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
import {
  OptionalFieldValue,
  SelectField,
  buildEnumOptions,
} from "@eshg/lib-portal";
import { ApiAppointmentBookingType } from "@eshg/prostitute-protection-api";

import { CONSULTATION_TYPE_VALUES } from "../../../shared/constants";
import { AppointmentFields } from "../../form/AppointmentFields";
import { ConsultantSelectField } from "../../form/ConsultantSelectField";

import { FieldProps, LayoutProps } from "./useAddNewProcedureSidebar";

interface AppointmentStepProps extends FieldProps {
  appointmentBookingType: OptionalFieldValue<ApiAppointmentBookingType>;
}

export function AppointmentStep(props: AppointmentStepProps) {
  return (
    <Layout {...props}>
      <Stack gap={2} mt={2}>
        <SelectField
          autoFocus
          name="consultationType"
          label="Beratungstyp"
          options={buildEnumOptions(CONSULTATION_TYPE_VALUES)}
        />
        <ConsultantSelectField
          name="consultantId"
          options={props.allAssignableUsers}
        />
        <Divider sx={{ marginBlock: 1 }} />
        <AppointmentFields
          isCreation
          freeAppointments={props.freeAppointments}
        />
      </Stack>
    </Layout>
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
