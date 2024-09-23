/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiAppointmentType } from "@eshg/employee-portal-api/travelMedicine";
import { BaseField } from "@eshg/lib-portal/components/formFields/BaseField";
import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { FormLabel, Input, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { translateAppointmentType } from "@/lib/businessModules/travelMedicine/components/appointmentTypes/translations";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface EditableAppointmentType {
  id: string;
  appointmentTypeDto: ApiAppointmentType;
  standardDurationInMinutes: string;
}

interface EditAppointmentTypeProps {
  initialValues: () => EditableAppointmentType;
  getSubmitButtonLabel: string;
  onSubmit: (values: EditableAppointmentType) => Promise<void>;
  onCancel: () => void;
  title: string;
}

export function AppointmentTypeEditForm(
  props: Readonly<EditAppointmentTypeProps>,
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
  ];

  return (
    <Formik
      initialValues={props.initialValues()}
      enableReinitialize={true}
      onSubmit={props.onSubmit}
    >
      {({ initialValues, isSubmitting, handleSubmit }) => (
        <SidebarForm onSubmit={handleSubmit}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <BaseField>
                <FormLabel>
                  <Typography level={"title-md"}>Typ</Typography>
                </FormLabel>
                <Input
                  placeholder={translateAppointmentType(
                    initialValues.appointmentTypeDto,
                  )}
                  readOnly={true}
                ></Input>
              </BaseField>
              <SingleAutocompleteField
                label={
                  <FormLabel>
                    <Typography level={"title-md"}>
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
