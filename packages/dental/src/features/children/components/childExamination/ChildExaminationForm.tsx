/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormikProps, FormikProvider } from "formik";

import { FormFooter, FormStack } from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

import { ExaminationFormValues } from "../../../../types/examination";

interface ChildExaminationFormProps extends RequiresChildren {
  form: FormikProps<ExaminationFormValues>;
}

export function ChildExaminationForm(props: ChildExaminationFormProps) {
  const { form } = props;
  return (
    <FormikProvider value={form}>
      <FormStack aria-label="Untersuchungen" onSubmit={form.handleSubmit}>
        {props.children}
        <FormFooter isSubmitting={form.isSubmitting} />
      </FormStack>
    </FormikProvider>
  );
}
