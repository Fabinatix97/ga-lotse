/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SwitchField } from "@/lib/shared/components/formFields/SwitchField";

export interface EmailNotificationsFormValues {
  sendEmailNotifications: boolean;
}

interface EmailNotificationsFormProps {
  initialValues: EmailNotificationsFormValues;
  formRef: Ref<SidebarFormHandle>;
  onCancel: () => void;
  onSubmit: (values: EmailNotificationsFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function EmailNotificationsForm(
  props: Readonly<EmailNotificationsFormProps>,
) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ isSubmitting }) => (
        <SidebarForm ref={props.formRef}>
          <SidebarContent title={props.title}>
            <Stack gap={2} rowGap={2}>
              <SwitchField
                label="E-Mail-Benachrichtigungen an Bürger:in"
                name="sendEmailNotifications"
              />
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
