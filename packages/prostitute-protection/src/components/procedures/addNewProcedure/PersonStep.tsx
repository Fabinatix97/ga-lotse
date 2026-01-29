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
  InputField,
  OptionalFieldValue,
  PhoneNumberField,
  useValidateLength,
} from "@eshg/lib-portal";
import { ApiAppointmentBookingType } from "@eshg/prostitute-protection-api";

import { PERSON_FIELD_NAME } from "../../../shared/constants";
import { LanguageFields } from "../../form/LanguageFields";

import {
  AddNewProcedureForm,
  FieldProps,
  LayoutProps,
} from "./useAddNewProcedureSidebar";

interface PersonStepProps extends FieldProps {
  appointmentBookingType: OptionalFieldValue<ApiAppointmentBookingType>;
}

export function PersonStep(props: PersonStepProps) {
  const validateLength = useValidateLength();

  return (
    <Layout {...props}>
      <Stack gap={2} mt={2}>
        <InputField
          autoFocus
          name="alias"
          label={PERSON_FIELD_NAME.alias}
          required={
            props.appointmentBookingType ===
            ApiAppointmentBookingType.Spontaneous
              ? undefined
              : "Bitte einen Alias angeben."
          }
          validate={validateLength(1, 80)}
        />
        <PhoneNumberField
          name="phoneNumber"
          label="Telefonnummer"
          validate={validateLength(1, 23)}
        />
        <Divider sx={{ marginBlock: 1 }} />
        <LanguageFields />
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
