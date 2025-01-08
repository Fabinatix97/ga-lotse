/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { FormProps, OptionalFieldValue } from "@eshg/lib-portal/types/form";
import { Formik } from "formik";

import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { FormStack } from "@/lib/shared/components/form/FormStack";

export interface ExaminationFormValues {
  note: OptionalFieldValue<string>;
}

export function ExaminationDetails(props: FormProps<ExaminationFormValues>) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <FormStack onSubmit={handleSubmit}>
            <InputField type="text" label="Bemerkung" name="note" />
            <FormFooter isSubmitting={isSubmitting} />
          </FormStack>
        );
      }}
    </Formik>
  );
}
