/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";
import { Formik, FormikValues } from "formik";
import { ReactNode } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import {
  DateField,
  InputField,
  useValidateLength,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import { FieldProps } from "./useAddNewProcedureSidebar";

export function PersonStep({ currentState, ...props }: FieldProps) {
  return (
    <Layout initialValues={currentState} {...props}>
      <Fields />
    </Layout>
  );
}

function Fields() {
  const validateLength = useValidateLength();

  return (
    <Stack gap={2}>
      <InputField
        name="firstName"
        label="Vorname"
        validate={(value) => (value ? validateLength(1, 80)(value) : undefined)}
      />
      <InputField
        name="lastName"
        label="Nachname"
        required="Bitte einen Nachnamen angeben."
        validate={validateLength(1, 120)}
      />
      <InputField name="alias" label="Alias" validate={validateLength(1, 80)} />
      <DateField
        name="dateOfBirth"
        label="Geburtsdatum"
        validate={(value) => (value ? validateDateOfBirth(value) : undefined)}
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
