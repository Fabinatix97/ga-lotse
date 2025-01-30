/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormProps } from "@eshg/lib-portal/types/form";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Formik } from "formik";

import { ExaminationFormValues } from "@/lib/businessModules/dental/features/examinations/ExaminationFormLayout";
import { FormFooter } from "@/lib/businessModules/schoolEntry/features/procedures/examinations/FormFooter";
import { FormStack } from "@/lib/shared/components/form/FormStack";

interface ChildExaminationFormProps
  extends FormProps<ExaminationFormValues>,
    RequiresChildren {}

export function ChildExaminationForm(props: ChildExaminationFormProps) {
  return (
    <Formik
      initialValues={props.initialValues}
      onSubmit={props.onSubmit}
      enableReinitialize
    >
      {({ handleSubmit, isSubmitting }) => {
        return (
          <FormStack onSubmit={handleSubmit}>
            {props.children}
            <FormFooter isSubmitting={isSubmitting} />
          </FormStack>
        );
      }}
    </Formik>
  );
}
