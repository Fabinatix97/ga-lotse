/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Sheet, Stack, Typography } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Formik, FormikValues, useField } from "formik";
import { ReactNode } from "react";

import {
  ApiAppointmentType,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { SelectField } from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { useGetFreeAppointmentsQuery } from "@/lib/businessModules/travelMedicine/api/queries/appointmentBlocks";
import { AppointmentRadioGroup } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/AppointmentRadioGroup";

import { FieldProps } from "./useAddNewProcedureSidebar";

export function AppointmentStep({ currentState, ...props }: FieldProps) {
  return (
    <Layout initialValues={currentState} {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  const [{ value: appointmentType }] =
    useField<ApiAppointmentType>("appointmentType");
  const [
    { data: freeConsultationBlockAppointments },
    { data: freeVaccinationBlockAppointments },
  ] = useSuspenseQueries({
    queries: [
      useGetFreeAppointmentsQuery(ApiAppointmentType.Consultation),
      useGetFreeAppointmentsQuery(ApiAppointmentType.Vaccination),
    ],
  });

  return (
    <Stack gap={2} rowGap={2}>
      <Sheet>
        <SelectField
          label="Terminart"
          name="appointmentType"
          options={[
            {
              value: ApiAppointmentType.Consultation,
              label: "Beratung",
            },
            { value: ApiAppointmentType.Vaccination, label: "Impfung" },
          ]}
          sx={{ flexGrow: 1 }}
        />
      </Sheet>
      <AppointmentRadioGroup
        label={
          <Typography level="body-md" sx={{ fontWeight: theme.fontWeight.lg }}>
            Termin
          </Typography>
        }
        name="appointmentBookingType"
        type={appointmentType}
        freeConsultationBlockAppointments={freeConsultationBlockAppointments}
        freeVaccinationBlockAppointments={freeVaccinationBlockAppointments}
      />
    </Stack>
  );
}

interface LayoutProps<T> {
  children: ReactNode;
  handleNext: (newValues: T) => Promise<unknown> | void;
  handlePrev: () => void;
  initialValues: T & FormikValues;
  isOnLastStep: boolean;
  isOnFirstStep: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  isPending: boolean;
}
function Layout<T>({
  children,
  handleNext,
  handlePrev,
  initialValues,
  isOnLastStep,
  isOnFirstStep,
  onClose,
  title,
  subTitle,
  isPending,
}: LayoutProps<T>) {
  return (
    <Formik initialValues={initialValues} onSubmit={handleNext}>
      <SidebarForm>
        <SidebarContent title={title} subtitle={subTitle}>
          {children}
        </SidebarContent>
        <SidebarActions>
          <MultiFormButtonBar
            submitting={isPending}
            submitLabel={isOnLastStep ? "Erstellen" : "Weiter"}
            onCancel={onClose}
            onBack={isOnFirstStep ? undefined : handlePrev}
          />
        </SidebarActions>
      </SidebarForm>
    </Formik>
  );
}
