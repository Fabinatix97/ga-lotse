/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik, FormikValues } from "formik";
import { ReactNode } from "react";

import {
  CustomAppointmentQuickButtons,
  DateTimeField,
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import {
  NumberField,
  validateIntegerAnd,
  validateRange,
} from "@eshg/lib-portal";

import { validateDateTimeIsTodayOrFuture } from "../../../shared/helpers";

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
    <Stack gap={2}>
      <DateTimeField
        name="customAppointmentDate"
        label="Datum und Zeit"
        required="Datum und Zeit sind erforderlich"
        validate={validateDateTimeIsTodayOrFuture}
      />
      <CustomAppointmentQuickButtons />
      <NumberField
        name="duration"
        label="Termindauer in Minuten"
        required="Die Besuchsdauer ist erforderlich."
        validate={validateIntegerAnd(validateRange(1, 1440))}
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
