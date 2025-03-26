/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
  TextareaField,
} from "@eshg/lib-employee-portal";
import { List, ListItem, Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";

export interface CancelAppointmentFormValues {
  reasonForRejection: string;
}

interface CancelAppointmentFormProps {
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: CancelAppointmentFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

const INITIAL_VALUES: CancelAppointmentFormValues = {
  reasonForRejection: "",
};

export function CancelAppointmentForm(
  props: Readonly<CancelAppointmentFormProps>,
) {
  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <List marker="disc" data-testid="rejection-reason-information">
                <ListItem sx={{ padding: 0 }}>
                  Der/die Bürger:in wird über die Absage per E-Mail informiert.
                </ListItem>
                <ListItem sx={{ padding: 0 }}>
                  Optional können Sie einen Grund der Absage angeben, der
                  dem/der Bürger:in im Online Portal sowie der E-Mail angezeigt
                  wird.
                </ListItem>
                <ListItem sx={{ padding: 0 }}>
                  Im Anschluss kann ein neuer Termin gebucht werden.
                </ListItem>
              </List>
              <TextareaField
                name="reasonForRejection"
                label="Grund der Absage"
                minRows={3}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={props.submitLabel}
              submitButtonColor="danger"
              submitting={isSubmitting}
              onCancel={props.onCancel}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
