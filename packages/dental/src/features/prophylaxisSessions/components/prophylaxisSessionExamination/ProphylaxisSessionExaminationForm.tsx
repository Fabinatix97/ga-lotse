/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormikProps, FormikProvider } from "formik";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { FormPlus, RequiresChildren } from "@eshg/lib-portal";

import { ExaminationFormValues } from "../../../../types/examination";

interface ProphylaxisSessionExaminationFormProps extends RequiresChildren {
  form: FormikProps<ExaminationFormValues>;
}

export function ProphylaxisSessionExaminationForm(
  props: ProphylaxisSessionExaminationFormProps,
) {
  return (
    <FormikProvider value={props.form}>
      <MainContentLayout fullViewportHeight>
        <FormPlus aria-label="Untersuchung">{props.children}</FormPlus>
      </MainContentLayout>
    </FormikProvider>
  );
}
