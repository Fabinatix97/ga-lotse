/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { DateField } from "@eshg/lib-portal";
import { ApiProcedureStepService } from "@eshg/travel-medicine-api";

export interface EditEarliestDateFormValues {
  earliestDate: string;
}

interface EditEarliestDateFormProps {
  initialValues: EditEarliestDateFormValues;
  procedureStepServices?: ApiProcedureStepService[];
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: EditEarliestDateFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function EditEarliestDateForm(
  props: Readonly<EditEarliestDateFormProps>,
) {
  return (
    <Formik
      initialValues={props.initialValues}
      enableReinitialize
      onSubmit={props.onSubmit}
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack spacing={2}>
              <Stack gap={2}>
                <Typography level="body-md" sx={{ fontWeight: "bold", mt: 2 }}>
                  Impfungen
                </Typography>
                {props.procedureStepServices && (
                  <List sx={{ padding: 0 }}>
                    {props.procedureStepServices.map((service, index) => (
                      <ListItem key={index} sx={{ padding: 0 }}>
                        {`${service.serviceDescription}${service.vaccinationNumber ? ` - Nr. ${service.vaccinationNumber}` : ""}`}
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
              <Stack>
                <Typography level="body-md" sx={{ fontWeight: "bold", mt: 2 }}>
                  Selbstbucher über Bürgerportal
                </Typography>
                <DateField
                  name="earliestDate"
                  label="Buchbar ab"
                  required="Bitte ein Datum für die früheste Buchbarkeit eingeben"
                />
              </Stack>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel}
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
