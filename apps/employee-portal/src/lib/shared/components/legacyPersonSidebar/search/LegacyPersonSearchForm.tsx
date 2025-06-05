/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import SearchIcon from "@mui/icons-material/Search";
import { Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode, RefObject } from "react";

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import {
  DateField,
  InputField,
  SubmitButton,
  validateDateOfBirth,
} from "@eshg/lib-portal";

import {
  LegacyMinimalPerson,
  MINIMAL_PERSON_VALUES,
} from "@/lib/shared/components/legacyPersonSidebar/form/LegacyBasePersonForm";

interface LegacyPersonSearchFormProps {
  onSubmit: (personSearch: LegacyMinimalPerson) => void;
  cancelButton: ReactNode;
  title: string;
  additionalFields?: () => ReactNode;
  initialFormValues?: LegacyMinimalPerson;
  sidebarFormRef?: RefObject<SidebarFormHandle | null>;
  loading?: boolean;
}

export function LegacyPersonSearchForm({
  onSubmit,
  cancelButton,
  title,
  additionalFields,
  initialFormValues,
  sidebarFormRef,
  loading,
}: LegacyPersonSearchFormProps) {
  function handleSubmit(personSearch: LegacyMinimalPerson) {
    onSubmit(personSearch);
  }

  return (
    <Formik
      initialValues={initialFormValues ?? MINIMAL_PERSON_VALUES}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={sidebarFormRef}>
          <SidebarContent title={title}>
            <Typography sx={{ mb: 2 }}>Nach einer Person suchen</Typography>
            <Stack gap={4}>
              {additionalFields?.()}
              <InputField
                name="firstName"
                label="Vorname"
                required="Bitte einen Vornamen angeben."
              />
              <InputField
                name="lastName"
                label="Nachname"
                required="Bitte einen Nachnamen angeben."
              />
              <DateField
                name="dateOfBirth"
                label="Geburtsdatum"
                required="Bitte ein Geburtsdatum angeben."
                validate={validateDateOfBirth}
              />
              <SubmitButton
                submitting={loading === true || isSubmitting}
                startDecorator={<SearchIcon />}
                sx={{ alignSelf: "end" }}
              >
                Suche
              </SubmitButton>
            </Stack>
          </SidebarContent>

          <SidebarActions>{cancelButton}</SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
