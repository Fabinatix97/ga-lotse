/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { validateLength } from "@eshg/lib-portal/helpers/validators";
import { Stack } from "@mui/joy";
import { Formik } from "formik";

import { OtherServiceTemplateFormValues } from "@/lib/businessModules/travelMedicine/components/otherServiceTemplates/OtherServiceTemplateForm";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { validateNonNegativeNumberWithAtMostTwoDecimalDigits } from "@/lib/shared/helpers/validators";

export function OtherServiceTemplateSidebarStepForm({
  initialValues,
  onSubmit,
  onCancel,
}: Readonly<{
  initialValues: OtherServiceTemplateFormValues;
  onSubmit: (values: OtherServiceTemplateFormValues) => Promise<void>;
  onCancel: () => void;
}>) {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      onSubmit={async (formValues, formikHelpers) => {
        await onSubmit(formValues);
        formikHelpers.resetForm();
      }}
    >
      {({ isSubmitting, resetForm, values }) => (
        <FormPlus style={{ display: "contents" }}>
          <SidebarContent
            title={values.id ? "Leistung bearbeiten" : "Leistung hinzufügen"}
          >
            <Stack gap={2}>
              <InputField
                name="description"
                label="Name"
                required="Bitte einen Namen angeben."
                validate={validateLength(0, 200)}
              />
              <NumberField
                name="fee"
                label="Preis in €"
                required="Bitte einen Preis angeben."
                validate={validateNonNegativeNumberWithAtMostTwoDecimalDigits}
              />
            </Stack>
          </SidebarContent>

          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={values.id ? "Speichern" : "Hinzufügen"}
              submitting={isSubmitting}
              onCancel={() => {
                resetForm();
                onCancel();
              }}
            />
          </SidebarActions>
        </FormPlus>
      )}
    </Formik>
  );
}
