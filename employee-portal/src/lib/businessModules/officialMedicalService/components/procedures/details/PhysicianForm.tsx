/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SingleAutocompleteField } from "@eshg/lib-portal/components/formFields/autocomplete/SingleAutocompleteField";
import { ApiUser } from "@eshg/official-medical-service-api";
import { Stack } from "@mui/joy";
import { Formik } from "formik";
import { Ref } from "react";

import { createPhysicianOptions } from "@/lib/businessModules/travelMedicine/components/vaccinationConsultations/shared/helpers";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export interface PhysicianFormValues {
  physician?: string;
}

interface PhysicianFormProps {
  initialValues: PhysicianFormValues;
  formRef: Ref<SidebarFormHandle>;
  allPhysicians: ApiUser[];
  onCancel: () => void;
  onSubmit: (values: PhysicianFormValues) => Promise<void>;
  title: string;
  submitLabel: string;
}

export function PhysicianForm(props: Readonly<PhysicianFormProps>) {
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
              <SingleAutocompleteField
                label="Ärzt:in"
                name="physician"
                required="Bitte Ärzt:in auswählen"
                options={createPhysicianOptions(props.allPhysicians)}
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
