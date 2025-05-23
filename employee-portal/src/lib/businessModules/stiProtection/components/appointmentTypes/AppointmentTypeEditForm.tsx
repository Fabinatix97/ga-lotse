/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormLabel, Input, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import { BaseField, SingleAutocompleteField } from "@eshg/lib-portal";
import { ApiAppointmentType } from "@eshg/sti-protection-api";

import { APPOINTMENT_TYPES } from "@/lib/businessModules/stiProtection/shared/constants";

export interface EditableAppointmentType {
  id: string;
  appointmentTypeDto: ApiAppointmentType;
  standardDurationInMinutes: string;
}

interface AppointmentTypeEditFormProps {
  initialValues: EditableAppointmentType;
  getSubmitButtonLabel: string;
  onSubmit: (values: EditableAppointmentType) => Promise<unknown>;
  onCancel: () => void;
  title: string;
}

export function AppointmentTypeEditForm(
  props: Readonly<AppointmentTypeEditFormProps>,
) {
  const standardDurationOptions: {
    label: string;
    value: string;
  }[] = [
    {
      value: "15",
      label: "15 min",
    },
    {
      value: "30",
      label: "30 min",
    },
    {
      value: "45",
      label: "45 min",
    },
    {
      value: "60",
      label: "60 min",
    },
  ];

  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ initialValues, isSubmitting, handleSubmit }) => (
        <SidebarForm onSubmit={handleSubmit}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <BaseField>
                <FormLabel>
                  <Typography level="title-md">Typ</Typography>
                </FormLabel>
                <Input
                  placeholder={
                    APPOINTMENT_TYPES[initialValues.appointmentTypeDto]
                  }
                  readOnly
                />
              </BaseField>
              <SingleAutocompleteField
                label={
                  <FormLabel>
                    <Typography level="title-md">
                      Standarddauer (Minuten)
                    </Typography>
                  </FormLabel>
                }
                name="standardDurationInMinutes"
                required="Bitte eine Dauer auswählen"
                options={standardDurationOptions}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.getSubmitButtonLabel}
              submitting={isSubmitting}
              onCancel={() => {
                props.onCancel();
              }}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
