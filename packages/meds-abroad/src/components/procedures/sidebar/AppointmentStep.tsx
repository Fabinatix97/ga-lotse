/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Formik, FormikValues } from "formik";
import { ReactNode } from "react";

import {
  MultiFormButtonBar,
  RadioSheetOption,
  RadioSheets,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";

import { ConnectedAppointmentPicker } from "./ConnectedAppointmentPicker";
import { FieldProps } from "./useAddNewProcedureSidebar";

export function AppointmentStep({ currentState, ...props }: FieldProps) {
  return (
    <Layout initialValues={currentState} {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  return (
    <RadioSheets
      name="appointmentBookingType"
      required="Bitte eine Buchungsart auswählen"
    >
      <RadioSheetOption
        name="appointmentBookingType"
        value="none"
        label="Ohne Termin"
      />
      <RadioSheetOption
        label="Termin"
        name="appointmentBookingType"
        value="block"
      >
        <ConnectedAppointmentPicker name="blockAppointment" />
      </RadioSheetOption>
    </RadioSheets>
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
