/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAppointmentType,
  ApiBookingType,
} from "@eshg/employee-portal-api/officialMedicalService";
import { SubmitButton } from "@eshg/lib-portal/components/buttons/SubmitButton";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import {
  AppointmentPickerField,
  FIELD_LABELS_DE,
} from "@eshg/lib-portal/components/formFields/appointmentPicker/AppointmentPickerField";
import {
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal/helpers/validators";
import { Button, Sheet, Stack } from "@mui/joy";
import { addMinutes } from "date-fns";
import { Formik } from "formik";
import { useState } from "react";

import { usePostAppointment } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { DateTimeField } from "@/lib/shared/components/formFields/DateTimeField";
import {
  RadioAccordionGroupField,
  RadioAccordionItem,
} from "@/lib/shared/components/formFields/RadioAccordionField";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

const now = new Date();

interface Appointment {
  start: Date;
  end: Date;
}

const appointments = new Array(100).fill(0).map((_, t): Appointment => {
  const start = addMinutes(now, t * 15 + (t % 10) * 3600);
  return {
    start,
    end: addMinutes(start, 10),
  };
});

interface AppointmentFormValues {
  bookingType: ApiBookingType;
  appointment?: Appointment;
  start: string;
  duration: number;
}

export function useCreateAppointmentSidebar(procedureId: string) {
  const { mutateAsync: createAppointment } = usePostAppointment();

  return useSidebarWithFormRef({
    component: (props: Readonly<SidebarWithFormRefProps>) => {
      async function handleSave(values: AppointmentFormValues) {
        await createAppointment({
          procedureId,
          request: {
            appointmentType: ApiAppointmentType.OfficialMedicalService,
            bookingInfo: {
              bookingType: values.bookingType,
              start: new Date(values.start),
              duration: values.duration,
            },
          },
        });
      }

      return EmbeddedAppointmentSidebar({ onSave: handleSave, ...props });
    },
  });
}

export function useAppointmentSidebar() {
  return useSidebarWithFormRef({
    component: EmbeddedAppointmentSidebar,
  });
}

interface AppointmentSidebarProps extends SidebarWithFormRefProps {
  onSave?: (values: AppointmentFormValues) => Promise<void>;
}

function EmbeddedAppointmentSidebar({
  formRef,
  onClose: handleClose,
  onSave,
}: Readonly<AppointmentSidebarProps>) {
  async function handleSubmit(values: AppointmentFormValues) {
    await onSave?.(values);
    handleClose(true);
  }

  return (
    <Formik
      initialValues={
        {
          bookingType: ApiBookingType.AppointmentBlock,
          appointment: undefined,
          start: "",
          duration: 30,
        } as AppointmentFormValues
      }
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={formRef}>
          <SidebarContent title="Termin buchen">
            <RadioAccordionGroupField name="bookingType">
              <RadioAccordionItem
                value={ApiBookingType.AppointmentBlock}
                label="Aus Terminblock"
              >
                {(isExpanded) => (
                  <AppointmentBlockForm isExpanded={isExpanded} />
                )}
              </RadioAccordionItem>
              <RadioAccordionItem
                value={ApiBookingType.UserDefined}
                label="Individueller Termin"
              >
                {(isExpanded) => (
                  <AppointmentUserDefinedForm isExpanded={isExpanded} />
                )}
              </RadioAccordionItem>
            </RadioAccordionGroupField>
          </SidebarContent>
          <SidebarActions>
            <ButtonBar
              left={
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleClose(true)}
                >
                  Abbrechen
                </Button>
              }
              right={
                <SubmitButton submitting={isSubmitting}>Buchen</SubmitButton>
              }
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function AppointmentBlockForm({
  isExpanded = true,
}: Readonly<{
  isExpanded?: boolean;
}>) {
  const [month, setMonth] = useState<Date>(new Date());

  return (
    <Sheet variant="plain" sx={{ borderRadius: "8px" }}>
      <AppointmentPickerField
        sx={{
          // just for aligning the separator line
          width: "min-content",
        }}
        name="appointment"
        currentMonth={month}
        setCurrentMonth={setMonth}
        monthAppointments={appointments}
        required={isExpanded}
        labels={FIELD_LABELS_DE}
      />
    </Sheet>
  );
}

function AppointmentUserDefinedForm({
  isExpanded = true,
}: Readonly<{
  isExpanded?: boolean;
}>) {
  return (
    <Stack gap={2}>
      <DateTimeField
        name="start"
        label="Datum und Zeit"
        required={isExpanded ? "Datum und Zeit sind erforderlich" : undefined}
      />
      <NumberField
        name="duration"
        label="Termindauer in Minuten"
        validate={validateIntegerAnd(validateRange(0, 1440))}
        required={isExpanded ? "Termindauer ist erforderlich" : undefined}
      />
    </Stack>
  );
}
